import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  User,
  Navigation,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  Banknote,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Truck,
  FileDown,
  Printer
} from 'lucide-react';
import { useCart } from '../context/useCart';
import { useStore } from '../context/useStore';
import { useLanguage } from '../context/useLanguage';
import { wilayas } from '../data/wilayas';
import { downloadOrderPDF } from '../utils/generateInvoicePDF';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { createOrder, siteSettings } = useStore();
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    notes: '',
    paymentMethod: 'cod',
  });

  const [selectedWilaya, setSelectedWilaya] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // When order is placed, auto-download the PDF onto customer device
  useEffect(() => {
    if (placedOrder && !pdfDownloaded) {
      const timer = setTimeout(() => {
        downloadOrderPDF(placedOrder, siteSettings);
        setPdfDownloaded(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [placedOrder, pdfDownloaded, siteSettings]);

  const deliveryFee = selectedWilaya ? Number(selectedWilaya.fee || 0) : 0;
  const grandTotal = Number(totalPrice || 0) + deliveryFee;

  const formatPrice = (price) => `${Number(price || 0).toLocaleString()} DZD`;

  const detectDeviceLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus({
        type: 'error',
        message: language === 'ar' ? 'خاصية تحديد الموقع غير مدعومة في متصفحك.' : 'La géolocalisation n\'est pas prise en charge.',
      });
      return;
    }
    setIsLocating(true);
    setLocationStatus(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': language === 'ar' ? 'ar' : 'fr' } }
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data.display_name) {
              setFormData((prev) => ({ ...prev, location: data.display_name }));
              setLocationStatus({ type: 'success', message: t('locationDetected') });
              setErrors((prev) => ({ ...prev, location: null }));
              setIsLocating(false);
              return;
            }
          }
        } catch (err) {
          console.warn('Reverse geocoding error:', err);
        }
        const coordsString = `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setFormData((prev) => ({ ...prev, location: coordsString }));
        setLocationStatus({ type: 'success', message: t('locationDetected') });
        setErrors((prev) => ({ ...prev, location: null }));
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = language === 'ar' ? 'تعذر الوصول إلى موقع الجهاز.' : 'Impossible d\'accéder à la position.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = language === 'ar' ? 'تم رفض إذن تحديد الموقع. يرجى إدخال العنوان يدوياً.' : 'Autorisation GPS refusée. Veuillez saisir l\'adresse manuellement.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = language === 'ar' ? 'بيانات الموقع غير متوفرة.' : 'Position GPS non disponible.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = language === 'ar' ? 'انتهت مهلة تحديد الموقع.' : 'Délai de détection dépassé.';
        }
        setLocationStatus({ type: 'error', message: errorMsg });
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = `${t('fullName')} *`;
    const cleanPhone = formData.phone.replace(/[^0-9+]/g, '');
    if (!formData.phone.trim() || cleanPhone.length < 9) {
      newErrors.phone = `${t('phoneNumber')} * (min 9)`;
    }
    if (!selectedWilaya) newErrors.wilaya = t('wilayaRequired');
    if (!formData.location.trim()) newErrors.location = `${t('deliveryLocation')} *`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }
    setIsSubmitting(true);
    try {
      const wilayaDisplayName = language === 'ar'
        ? `${selectedWilaya.nameAr || selectedWilaya.name} (${selectedWilaya.name})`
        : selectedWilaya.name;

      const orderRecord = await createOrder({
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim() || 'client@auracommerce.com',
          phone: formData.phone.trim(),
          location: `${selectedWilaya.name} - ${formData.location.trim()}`,
          notes: formData.notes.trim(),
          coordinates,
          wilaya: wilayaDisplayName,
          deliveryFee: deliveryFee,
        },
        items: cartItems.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          image: item.selectedColor?.image || item.product.image,
          category: item.product.category,
          quantity: Number(item.quantity),
          selectedColor: item.selectedColor || null,
        })),
        subtotal: Number(totalPrice),
        shipping: deliveryFee,
        deliveryFee: deliveryFee,
        total: grandTotal,
        paymentMethod: 'cod',
      });

      // Ensure returned order has shipping and total populated correctly
      const finalOrder = {
        ...orderRecord,
        shipping: deliveryFee,
        total: grandTotal,
        subtotal: Number(totalPrice),
      };

      setPlacedOrder(finalOrder);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Order submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was successfully placed, display confirmation screen
  if (placedOrder) {
    return (
      <div className="checkout-page-container">
        <div className="container confirmation-wrapper">
          <div className="confirmation-card">
            <div className="confirmation-badge">
              <CheckCircle2 size={64} className="confirmation-icon" />
            </div>
            <h1 className="confirmation-title">{t('orderConfirmed')}</h1>
            <p className="confirmation-subtitle">
              {t('thankYouOrder', {
                name: placedOrder.customer?.name || '',
                id: placedOrder.id || '',
              })}
            </p>

            {/* Auto-download PDF notification box */}
            <div className="pdf-auto-alert-box">
              <FileDown size={20} className="pdf-icon-pulse" />
              <span>{t('autoDownloadNotice')}</span>
            </div>

            {/* PDF Action Buttons */}
            <div className="invoice-action-buttons">
              <button
                type="button"
                onClick={() => downloadOrderPDF(placedOrder, siteSettings)}
                className="invoice-download-btn"
              >
                <FileDown size={18} />
                <span>{t('downloadInvoice')}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="invoice-print-btn"
              >
                <Printer size={18} />
                <span>{t('printInvoice')}</span>
              </button>
            </div>

            <div className="order-summary-box">
              <div className="summary-section">
                <h3>{t('customerInfo')}</h3>
                <div className="detail-item">
                  <User size={16} />
                  <span>{placedOrder.customer?.name}</span>
                </div>
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{placedOrder.customer?.phone}</span>
                </div>
                <div className="detail-item">
                  <Truck size={16} />
                  <span>{t('wilaya')} : {placedOrder.customer?.wilaya}</span>
                </div>
                <div className="detail-item location">
                  <MapPin size={16} className="loc-pin-icon" />
                  <div>
                    <span>{placedOrder.customer?.location}</span>
                    {placedOrder.customer?.coordinates && (
                      <span className="gps-verified-tag">
                        GPS ({placedOrder.customer.coordinates.lat.toFixed(4)}, {placedOrder.customer.coordinates.lng.toFixed(4)})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="summary-section">
                <h3>{t('orderedItems')} ({placedOrder.items?.length})</h3>
                <div className="confirmed-items-list">
                  {placedOrder.items?.map((item, idx) => (
                    <div key={idx} className="confirmed-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        {item.selectedColor && (
                          <span className="confirmed-item-color">
                            {t('color')} : {item.selectedColor.name}
                          </span>
                        )}
                        <span>{t('quantity')} : {item.quantity}</span>
                      </div>
                      <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="total-bar" style={{ flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{t('subtotalItems')} :</span>
                  <span>{formatPrice(placedOrder.subtotal || 0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{t('deliveryFee')} ({placedOrder.customer?.wilaya}) :</span>
                  <span>{formatPrice(placedOrder.shipping ?? deliveryFee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontWeight: 800, fontSize: '1.2rem' }}>
                  <span>{t('totalToPay')} :</span>
                  <strong style={{ color: '#16a34a' }}>{formatPrice(placedOrder.total || grandTotal)}</strong>
                </div>
              </div>
            </div>

            <div className="cod-confirmed-badge">
              <Banknote size={24} />
              <div>
                <strong>{t('cashOnDeliveryBadge')}</strong>
                <p>{t('cashOnDeliveryDesc')}</p>
              </div>
            </div>

            <div className="confirmation-actions">
              <Link to="/" className="continue-shopping-cta">
                <ShoppingBag size={18} />
                <span>{t('returnShop')}</span>
              </Link>
              <Link to="/admin" className="view-admin-cta">
                <ShieldCheck size={18} />
                <span>{t('viewAdmin')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page-container">
        <div className="container text-center empty-checkout-wrap">
          <ShoppingBag size={64} className="empty-checkout-icon" />
          <h2>{t('emptyCart')}</h2>
          <p>{t('emptyCartPrompt')}</p>
          <Link to="/" className="back-to-shop-btn">
            <ArrowLeft size={18} />
            <span>{t('continueShopping')}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      <div className="container">
        {/* Navigation / Header */}
        <div className="checkout-header-bar">
          <button type="button" onClick={() => navigate(-1)} className="back-checkout-link">
            <ArrowLeft size={18} />
            <span>{t('back')}</span>
          </button>
          <h1 className="checkout-page-title">{t('orderPlacement')}</h1>
        </div>

        <div className="checkout-layout-grid">
          {/* Form Column */}
          <div className="checkout-form-column">
            <form onSubmit={handleSubmitOrder} className="checkout-form" noValidate>

              {/* Step 1: Customer Info */}
              <div className="form-card-section">
                <div className="section-title-wrap">
                  <span className="step-number">1</span>
                  <h2>{t('stepCustomer')}</h2>
                </div>

                <div className="form-fields-grid">
                  <div className="input-group">
                    <label htmlFor="client-name">
                      {t('fullName')} <span className="req">*</span>
                    </label>
                    <div className={`input-field-wrapper ${errors.name ? 'has-error' : ''}`}>
                      <User size={18} className="field-icon" />
                      <input
                        id="client-name"
                        type="text"
                        placeholder="Ex: Mohamed Benali"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        autoComplete="name"
                      />
                    </div>
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="input-group">
                    <label htmlFor="client-phone">
                      {t('phoneNumber')} <span className="req">*</span>
                    </label>
                    <div className={`input-field-wrapper ${errors.phone ? 'has-error' : ''}`}>
                      <Phone size={18} className="field-icon" />
                      <input
                        id="client-phone"
                        type="tel"
                        placeholder="Ex: 0550 12 34 56"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        autoComplete="tel"
                      />
                    </div>
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>

                  <div className="input-group full-width">
                    <label htmlFor="client-email">
                      {t('emailAddress')} <span className="optional-tag">{t('optional')}</span>
                    </label>
                    <div className="input-field-wrapper">
                      <Mail size={18} className="field-icon" />
                      <input
                        id="client-email"
                        type="email"
                        placeholder="Ex: mohamed@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Wilaya Selection */}
              <div className="form-card-section">
                <div className="section-title-wrap">
                  <span className="step-number">2</span>
                  <h2>{t('stepWilaya')}</h2>
                </div>
                <p className="section-desc">{t('selectWilayaPrompt')}</p>

                <div className="input-group full-width">
                  <label htmlFor="wilaya-select">
                    {t('wilaya')} <span className="req">*</span>
                  </label>
                  <div className={`input-field-wrapper ${errors.wilaya ? 'has-error' : ''}`}>
                    <Truck size={18} className="field-icon" />
                    <select
                      id="wilaya-select"
                      value={selectedWilaya ? selectedWilaya.code : ''}
                      onChange={(e) => {
                        const code = Number(e.target.value);
                        const found = wilayas.find((w) => w.code === code);
                        setSelectedWilaya(found || null);
                        if (errors.wilaya) setErrors((prev) => ({ ...prev, wilaya: null }));
                      }}
                      className="wilaya-select"
                    >
                      <option value="">-- {t('selectWilaya')} --</option>
                      {wilayas.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.code.toString().padStart(2, '0')} - {language === 'ar' ? (w.nameAr || w.name) : w.name} ({formatPrice(w.fee)})
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.wilaya && <span className="error-message">{errors.wilaya}</span>}
                </div>

                {selectedWilaya && (
                  <div className="wilaya-fee-badge">
                    <Truck size={18} />
                    <span>
                      {t('deliveryFee')} ({language === 'ar' ? (selectedWilaya.nameAr || selectedWilaya.name) : selectedWilaya.name}) :{' '}
                      <strong className="fee-amount">{formatPrice(selectedWilaya.fee)}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Step 3: Detailed Delivery Address */}
              <div className="form-card-section">
                <div className="section-title-wrap">
                  <span className="step-number">3</span>
                  <h2>{t('stepAddress')}</h2>
                </div>

                {/* Auto-detect button */}
                <div className="auto-detect-container">
                  <button
                    type="button"
                    onClick={detectDeviceLocation}
                    disabled={isLocating}
                    className="auto-detect-btn"
                  >
                    {isLocating ? (
                      <>
                        <Loader2 size={18} className="spinning" />
                        <span>{t('detectingLocation')}</span>
                      </>
                    ) : (
                      <>
                        <Navigation size={18} className="gps-icon" />
                        <span>{t('detectLocation')}</span>
                      </>
                    )}
                  </button>

                  {locationStatus && (
                    <div className={`location-status-badge ${locationStatus.type}`}>
                      {locationStatus.type === 'success' ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <AlertCircle size={16} />
                      )}
                      <span>{locationStatus.message}</span>
                    </div>
                  )}
                </div>

                <div className="input-group full-width">
                  <label htmlFor="client-location">
                    {t('deliveryLocation')} <span className="req">*</span>
                  </label>
                  <div className={`input-field-wrapper textarea-wrap ${errors.location ? 'has-error' : ''}`}>
                    <MapPin size={18} className="field-icon textarea-icon" />
                    <textarea
                      id="client-location"
                      rows={3}
                      placeholder={language === 'ar' ? 'الحي، العمارة، رقم الباب، المدينة...' : 'Ex: Cité 500 Logements, Bâtiment B, Appt 14...'}
                      value={formData.location}
                      onFocus={() => {
                        if (!formData.location && !isLocating && !locationStatus) {
                          detectDeviceLocation();
                        }
                      }}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                  {errors.location && <span className="error-message">{errors.location}</span>}
                </div>

                <div className="input-group full-width">
                  <label htmlFor="client-notes">{t('deliveryNotes')}</label>
                  <input
                    id="client-notes"
                    type="text"
                    placeholder={language === 'ar' ? 'ملاحظة للسائق، معلم قريب...' : 'Ex: Appeler avant d\'arriver...'}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="notes-input"
                  />
                </div>
              </div>

              {/* Step 4: Payment - Cash on Delivery Only */}
              <div className="form-card-section">
                <div className="section-title-wrap">
                  <span className="step-number">4</span>
                  <h2>{t('stepPayment')}</h2>
                </div>
                <div className="cod-only-card">
                  <Banknote size={32} className="cod-icon" />
                  <div className="cod-text">
                    <strong>{t('cashOnDeliveryOnly')}</strong>
                    <span>{t('cashOnDeliveryDesc')}</span>
                  </div>
                  <CheckCircle2 size={24} className="cod-check" />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="place-order-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={22} className="spinning" />
                    <span>{t('detectingLocation')}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={22} />
                    <span>{t('confirmOrder')} — {formatPrice(grandTotal)}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Summary Column */}
          <div className="checkout-summary-column">
            <div className="sticky-summary-card">
              <div className="summary-card-header">
                <h3>{t('orderSummary')}</h3>
                <span className="item-count-badge">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)} {t('items')}
                </span>
              </div>

              <div className="summary-items-scroll">
                {cartItems.map(({ product, quantity, selectedColor }) => (
                  <div
                    key={`${product.id}-${selectedColor?.name || 'default'}`}
                    className="summary-product-item"
                  >
                    <div className="summary-product-thumb">
                      <img
                        src={selectedColor?.image || product.image}
                        alt={product.name}
                      />
                      <span className="summary-qty-pill">{quantity}</span>
                    </div>
                    <div className="summary-product-details">
                      <h4>{product.name}</h4>
                      <span className="summary-cat">{product.category}</span>
                      {selectedColor && (
                        <span className="summary-color-tag">
                          <span
                            className="summary-color-dot"
                            style={{ backgroundColor: selectedColor.hex || selectedColor.code || '#888' }}
                          />
                          {selectedColor.name}
                        </span>
                      )}
                    </div>
                    <span className="summary-product-price">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-pricing-breakdown">
                <div className="breakdown-line">
                  <span>{t('subtotal')}</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="breakdown-line">
                  <span>
                    {t('deliveryFee')}
                    {selectedWilaya ? ` (${language === 'ar' ? (selectedWilaya.nameAr || selectedWilaya.name) : selectedWilaya.name})` : ''}
                  </span>
                  <span>
                    {selectedWilaya ? (
                      <strong className="fee-amount">{formatPrice(deliveryFee)}</strong>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {t('calculatedAtCheckout')}
                      </span>
                    )}
                  </span>
                </div>
                <div className="breakdown-line total">
                  <span>{t('total')}</span>
                  <span style={{ color: '#16a34a' }}>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="secure-badge-box">
                <ShieldCheck size={18} className="shield-icon" />
                <span>{t('cashOnDeliveryBadge')} · 58 {t('wilaya')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
