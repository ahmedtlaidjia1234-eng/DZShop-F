import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Settings,
  ShoppingBag,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Search,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  X,
  AlertCircle,
  Lock,
  LogOut,
  Shield,
  KeyRound,
  Upload,
  Zap,
  Globe,
  Palette,
  Truck,
  List,
  FileDown
} from 'lucide-react';
import { useStore } from '../context/useStore';
import { downloadOrderPDF } from '../utils/generateInvoicePDF';

export default function AdminPage() {
  const {
    siteSettings,
    updateSiteSettings,
    resetSiteSettings,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    orders,
    updateOrderStatus,
    deleteOrder,
    notification,
    adminUser,
    adminLogin,
    adminLogout,
    isBackendOnline,
    databaseEngine,
    updateAdminProfile,
    uploadImage,
  } = useStore();

  const [activeTab, setActiveTab] = useState('products');

  // Login State
  const [loginUsername, setLoginUsername] = useState('');//admin
  const [loginPassword, setLoginPassword] = useState('');//AdminSecurePass2026!
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Product Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    tagline: '',
    category: siteSettings.categories?.[0] || 'Audio',
    price: '',
    originalPrice: '',
    stockCount: '20',
    image: '',
    description: '',
    featuresText: '',
    colors: [],
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageFileRef = useRef(null);

  // Offer Image Upload
  const [isUploadingOfferImage, setIsUploadingOfferImage] = useState(false);
  const offerImageFileRef = useRef(null);

  // Color inputs in Product Modal
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000', image: '' });
  const [colorImageUploading, setColorImageUploading] = useState(false);
  const colorImageRef = useRef(null);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    siteName: siteSettings.siteName || 'AURA',
    siteSubtitle: siteSettings.siteSubtitle || 'COMMERCE',
    siteTagline: siteSettings.siteTagline || '',
    announcement: siteSettings.announcement || '',
    showAnnouncement: siteSettings.showAnnouncement ?? true,
    contactEmail: siteSettings.contactEmail || '',
    orderNotificationEmail: siteSettings.orderNotificationEmail || siteSettings.contactEmail || 'admin@auracommerce.com',
    currency: siteSettings.currency || 'DZD',
    offerEnabled: siteSettings.offerEnabled ?? false,
    offerTitle: siteSettings.offerTitle || '',
    offerSubtitle: siteSettings.offerSubtitle || '',
    offerDiscount: siteSettings.offerDiscount || '',
    offerBadge: siteSettings.offerBadge || '',
    offerProductId: siteSettings.offerProductId || '',
    offerImage: siteSettings.offerImage || '',
    seoMetaTitle: siteSettings.seoMetaTitle || '',
    seoMetaDescription: siteSettings.seoMetaDescription || '',
    seoKeywords: siteSettings.seoKeywords || '',
  });
  const [newCategory, setNewCategory] = useState('');
  const [categoriesList, setCategoriesList] = useState(() =>
    Array.isArray(siteSettings.categories)
      ? siteSettings.categories
      : ['Audio', 'Wearables', 'Tech & Office', 'Accessories', 'Vêtements', 'Lifestyle']
  );
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Security Form State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [securityMsg, setSecurityMsg] = useState('');
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  // Delete Confirmations
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteOrderConfirm, setDeleteOrderConfirm] = useState(null);

  // ==========================================
  // Handlers
  // ==========================================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await adminLogin(loginUsername, loginPassword);
    } catch (err) {
      setLoginError(err.message || 'Identifiants invalides.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      tagline: '',
      category: categoriesList[0] || 'Général',
      price: '',
      originalPrice: '',
      stockCount: '20',
      image: '',
      description: '',
      featuresText: '',
      colors: [],
    });
    setNewColor({ name: '', hex: '#000000', image: '' });
    setIsProductModalOpen(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      tagline: product.tagline || '',
      category: product.category || categoriesList[0] || 'Général',
      price: product.price?.toString() || '',
      originalPrice: product.originalPrice?.toString() || '',
      stockCount: product.stockCount?.toString() || '20',
      image: product.image || '',
      description: product.description || '',
      featuresText: Array.isArray(product.features)
        ? product.features.join('\n')
        : (product.featuresText || ''),
      colors: Array.isArray(product.colors)
        ? product.colors.map(c => ({ ...c, hex: c.hex || c.code || '#000000' }))
        : [],
    });
    setNewColor({ name: '', hex: '#000000', image: '' });
    setIsProductModalOpen(true);
  };

  const handleDeviceImageUpload = async (file) => {
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setProductForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleColorImageUpload = async (file) => {
    if (!file) return;
    setColorImageUploading(true);
    try {
      const url = await uploadImage(file);
      setNewColor((prev) => ({ ...prev, image: url }));
    } catch (err) {
      console.error(err);
    } finally {
      setColorImageUploading(false);
    }
  };

  const handleOfferImageUpload = async (file) => {
    if (!file) return;
    setIsUploadingOfferImage(true);
    try {
      const url = await uploadImage(file);
      setSettingsForm((prev) => ({ ...prev, offerImage: url }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingOfferImage(false);
    }
  };

  const addColorToProduct = () => {
    if (!newColor.name.trim()) return;
    setProductForm((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        {
          name: newColor.name.trim(),
          hex: newColor.hex || '#000000',
          code: newColor.hex || '#000000',
          image: newColor.image ? newColor.image.trim() : '',
        },
      ],
    }));
    setNewColor({ name: '', hex: '#000000', image: '' });
  };

  const removeColorFromProduct = (index) => {
    setProductForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.price) return;

    const payload = {
      name: productForm.name.trim(),
      tagline: productForm.tagline.trim(),
      category: productForm.category,
      price: parseFloat(productForm.price),
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
      stockCount: parseInt(productForm.stockCount, 10) || 0,
      image: productForm.image.trim() || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
      description: productForm.description.trim(),
      features: productForm.featuresText.split('\n').map(s => s.trim()).filter(Boolean),
      colors: productForm.colors,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await addProduct(payload);
    }
    setIsProductModalOpen(false);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await updateSiteSettings({
        ...settingsForm,
        categories: categoriesList,
        offerProductId: settingsForm.offerProductId ? Number(settingsForm.offerProductId) : null,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categoriesList.includes(trimmed)) {
      setCategoriesList((prev) => [...prev, trimmed]);
      setNewCategory('');
    }
  };

  const removeCategory = (cat) => {
    setCategoriesList((prev) => prev.filter((c) => c !== cat));
  };

  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmPassword) {
      setSecurityMsg('❌ Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    if (!securityForm.currentPassword) {
      setSecurityMsg('❌ Le mot de passe actuel est requis pour toute modification.');
      return;
    }
    setIsSavingSecurity(true);
    setSecurityMsg('');
    try {
      await updateAdminProfile({
        currentPassword: securityForm.currentPassword,
        newUsername: securityForm.newUsername || undefined,
        newPassword: securityForm.newPassword || undefined,
      });
      setSecurityMsg('✅ Identifiants mis à jour avec succès !');
      setSecurityForm({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setSecurityMsg(`❌ ${err.message || 'Erreur lors de la mise à jour.'}`);
    } finally {
      setIsSavingSecurity(false);
    }
  };

  const formatPrice = (price) => `${Number(price || 0).toLocaleString()} DZD`;

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(productSearch.toLowerCase()));
    const matchCat = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    return matchSearch && matchCat;
  });

  const allDisplayCategories = ['All', ...new Set([...categoriesList, ...products.map((p) => p.category)])];

  // ==========================================
  // LOGIN SCREEN GATE
  // ==========================================
  if (!adminUser) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="login-card-header">
            <div className="login-shield-icon">
              <Shield size={36} />
            </div>
            <h1>Administration AURA</h1>
            <p>Accès sécurisé réservé aux gestionnaires de la boutique.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="login-input-group">
              <label htmlFor="login-user">Nom d'utilisateur</label>
              <div className="login-input-wrap">
                <User size={18} className="login-input-icon" />
                <input
                  id="login-user"
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="login-input-group">
              <label htmlFor="login-pass">Mot de passe</label>
              <div className="login-input-wrap">
                <Lock size={18} className="login-input-icon" />
                <input
                  id="login-pass"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="login-error-msg">
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <button type="submit" className="login-submit-btn" disabled={isLoggingIn}>
              {isLoggingIn ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="admin-page-container">
      {/* Top Header */}
      <div className="admin-top-header">
        <div className="admin-header-left">
          <Shield size={28} className="admin-shield" />
          <div>
            <h1>Portail d'Administration</h1>
            <p className="admin-sub">
              Connecté : <strong>{adminUser.username}</strong>
              {' · '}
              <span className={`db-status-dot ${isBackendOnline ? 'online' : 'offline'}`} />
              {isBackendOnline ? 'Backend Connecté' : 'Mode Mémoire'}
              {databaseEngine && databaseEngine !== 'Checking...' ? ` (${databaseEngine})` : ''}
            </p>
          </div>
        </div>

        <div className="admin-header-right">
          <Link to="/" className="admin-view-site-btn" target="_blank">
            <ExternalLink size={16} />
            <span>Voir la boutique</span>
          </Link>
          <button type="button" onClick={adminLogout} className="admin-logout-btn">
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className={`admin-notification-bar ${notification.isError ? 'error' : 'success'}`}>
          {notification.isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="admin-tabs-bar">
        {[
          { id: 'products', label: `Produits (${products.length})`, icon: <Package size={18} /> },
          { id: 'orders', label: `Commandes (${orders.length})`, icon: <ShoppingBag size={18} /> },
          { id: 'settings', label: 'Paramètres & SEO', icon: <Settings size={18} /> },
          { id: 'security', label: 'Sécurité Admin', icon: <KeyRound size={18} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="admin-tab-content">

        {/* ==========================================
            TAB 1: PRODUCTS
           ========================================== */}
        {activeTab === 'products' && (
          <div className="products-tab">
            <div className="products-tab-header">
              <div>
                <h2>Catalogue des Produits</h2>
                <p>Gérez vos articles, leurs prix en DZD, photos et déclinaisons de couleurs.</p>
              </div>
              <button type="button" onClick={openAddProduct} className="add-product-btn">
                <Plus size={18} />
                <span>Nouveau Produit</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="products-filter-bar">
              <div className="admin-search-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou description..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>

              <div className="admin-cat-filter">
                {allDisplayCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`admin-cat-pill ${productCategoryFilter === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="admin-products-grid">
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="admin-product-card">
                  <div className="admin-product-img-wrap">
                    <img src={prod.image} alt={prod.name} />
                    {Array.isArray(prod.colors) && prod.colors.length > 0 && (
                      <div className="admin-color-dots">
                        {prod.colors.slice(0, 5).map((col, idx) => (
                          <span
                            key={idx}
                            className="admin-color-dot"
                            style={{ backgroundColor: col.hex || col.code || '#000' }}
                            title={col.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="admin-product-info">
                    <h3>{prod.name}</h3>
                    <span className="admin-product-cat">{prod.category}</span>
                    <div className="admin-product-price-row">
                      <strong>{formatPrice(prod.price)}</strong>
                      {prod.originalPrice && (
                        <span className="admin-original-price">{formatPrice(prod.originalPrice)}</span>
                      )}
                    </div>
                    <span className="admin-stock-badge">
                      Stock : {prod.stockCount ?? 0}
                    </span>
                  </div>

                  <div className="admin-product-actions">
                    <Link
                      to={`/product/${prod.id}`}
                      className="admin-view-btn"
                      title="Voir le produit"
                      target="_blank"
                    >
                      <ExternalLink size={15} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => openEditProduct(prod)}
                      className="admin-edit-btn"
                      title="Modifier"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(prod.id)}
                      className="admin-delete-btn"
                      title="Supprimer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {deleteConfirm === prod.id && (
                    <div className="delete-confirm-overlay">
                      <p>Supprimer définitivement <strong>{prod.name}</strong> ?</p>
                      <div className="delete-confirm-btns">
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteProduct(prod.id);
                            setDeleteConfirm(null);
                          }}
                          className="confirm-del-yes"
                        >
                          Oui, supprimer
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(null)}
                          className="confirm-del-no"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="admin-empty-state">
                  <Package size={48} />
                  <p>Aucun produit ne correspond à ces critères.</p>
                </div>
              )}
            </div>

            <div className="admin-reset-row">
              <button type="button" onClick={resetProducts} className="admin-reset-btn">
                Réinitialiser le catalogue par défaut
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: ORDERS
           ========================================== */}
        {activeTab === 'orders' && (
          <div className="orders-tab">
            <div className="orders-tab-header">
              <div>
                <h2>Commandes Clients (Paiement à la Livraison)</h2>
                <p>Consultez les commandes, wilayas de livraison et mettez à jour leurs statuts.</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="admin-empty-state">
                <ShoppingBag size={48} />
                <p>Aucune commande enregistrée pour l'instant.</p>
              </div>
            ) : (
              <div className="orders-list">
                {[...orders].reverse().map((ord) => (
                  <div key={ord.id} className="order-card">
                    <div className="order-card-header">
                      <div>
                        <span className="order-id-badge">#{ord.id}</span>
                        <span className="order-date">
                          <Clock size={13} />
                          {ord.createdAt || ord.date ? new Date(ord.createdAt || ord.date).toLocaleDateString('fr-DZ') : 'Aujourd\'hui'}
                        </span>
                      </div>

                      <div className="order-header-right">
                        <select
                          value={ord.status || 'Processing'}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                          className={`order-status-select status-${ord.status || 'Processing'}`}
                        >
                          <option value="Processing">En attente</option>
                          <option value="Confirmed">Confirmée</option>
                          <option value="Shipped">Expédiée</option>
                          <option value="Delivered">Livrée</option>
                          <option value="Cancelled">Annulée</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => downloadOrderPDF(ord, siteSettings)}
                          className="admin-download-invoice-btn"
                          title="Télécharger la Facture PDF"
                        >
                          <FileDown size={15} />
                          <span>Facture PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteOrderConfirm(ord.id)}
                          className="admin-delete-btn"
                          title="Supprimer la commande"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="order-customer-info">
                      <div className="order-info-row">
                        <User size={15} />
                        <strong>{ord.customer?.name}</strong>
                      </div>
                      <div className="order-info-row">
                        <Phone size={15} />
                        <span>{ord.customer?.phone}</span>
                      </div>
                      {ord.customer?.email && ord.customer.email !== 'client@auracommerce.com' && (
                        <div className="order-info-row">
                          <Mail size={15} />
                          <span>{ord.customer?.email}</span>
                        </div>
                      )}
                      <div className="order-info-row">
                        <Truck size={15} />
                        <span>Wilaya : <strong>{ord.customer?.wilaya || 'N/A'}</strong></span>
                      </div>
                      <div className="order-info-row full-w">
                        <MapPin size={15} />
                        <span>{ord.customer?.location}</span>
                      </div>
                      {ord.customer?.notes && (
                        <div className="order-info-row full-w order-notes-box">
                          <span>Note client : <em>"{ord.customer.notes}"</em></span>
                        </div>
                      )}
                    </div>

                    <div className="order-items-preview">
                      {ord.items?.map((item, idx) => (
                        <div key={idx} className="order-item-chip">
                          <img src={item.image} alt={item.name} />
                          <span>{item.name} × {item.quantity}</span>
                          {item.selectedColor && (
                            <span className="order-item-color-tag">
                              ({item.selectedColor.name})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="order-totals">
                      <span>Sous-total : {formatPrice(ord.subtotal || 0)}</span>
                      <span>Livraison : {formatPrice(ord.shipping || 0)}</span>
                      <strong>Total : {formatPrice(ord.total || 0)}</strong>
                      <span className="cod-tag">💵 Paiement à la livraison</span>
                    </div>

                    {deleteOrderConfirm === ord.id && (
                      <div className="delete-confirm-overlay">
                        <p>Supprimer la commande <strong>#{ord.id}</strong> ?</p>
                        <div className="delete-confirm-btns">
                          <button
                            type="button"
                            onClick={async () => {
                              await deleteOrder(ord.id);
                              setDeleteOrderConfirm(null);
                            }}
                            className="confirm-del-yes"
                          >
                            Oui, supprimer
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteOrderConfirm(null)}
                            className="confirm-del-no"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 3: SETTINGS & SEO & OFFERS
           ========================================== */}
        {activeTab === 'settings' && (
          <div className="settings-tab">
            <form onSubmit={handleSaveSettings} className="settings-form">

              {/* General Site Information */}
              <div className="settings-section-card">
                <h3><Globe size={18} /> Identité de la Boutique</h3>
                <div className="settings-grid">
                  <div className="settings-field">
                    <label>Nom du site</label>
                    <input
                      type="text"
                      value={settingsForm.siteName}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, siteName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="settings-field">
                    <label>Sous-titre / Complément de marque</label>
                    <input
                      type="text"
                      value={settingsForm.siteSubtitle}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, siteSubtitle: e.target.value }))}
                    />
                  </div>
                  <div className="settings-field full-w">
                    <label>Slogan (Tagline)</label>
                    <input
                      type="text"
                      value={settingsForm.siteTagline}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, siteTagline: e.target.value }))}
                    />
                  </div>
                  <div className="settings-field">
                    <label>Email de contact général</label>
                    <input
                      type="email"
                      value={settingsForm.contactEmail}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, contactEmail: e.target.value }))}
                    />
                  </div>
                  <div className="settings-field">
                    <label>Email de réception des commandes (Notification)</label>
                    <input
                      type="email"
                      value={settingsForm.orderNotificationEmail}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, orderNotificationEmail: e.target.value }))}
                      placeholder="admin@auracommerce.com"
                    />
                  </div>
                  <div className="settings-field">
                    <label>Devise par défaut</label>
                    <input
                      type="text"
                      value={settingsForm.currency}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, currency: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="settings-field full-w mt-2">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={settingsForm.showAnnouncement}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, showAnnouncement: e.target.checked }))}
                    />
                    <span>Afficher la barre d'annonce en haut du site</span>
                  </label>
                  {settingsForm.showAnnouncement && (
                    <input
                      type="text"
                      value={settingsForm.announcement}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, announcement: e.target.value }))}
                      placeholder="Texte de l'annonce (ex: Livraison rapide vers 58 wilayas...)"
                      className="mt-1"
                    />
                  )}
                </div>
              </div>

              {/* Custom Categories Management */}
              <div className="settings-section-card">
                <h3><List size={18} /> Catégories Personnalisées</h3>
                <p className="settings-sub-text">
                  Ajoutez ou supprimez des catégories pour vos articles (vêtements, écouteurs, accessoires, etc.).
                </p>

                <div className="categories-list">
                  {categoriesList.map((cat) => (
                    <div key={cat} className="category-tag-item">
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => removeCategory(cat)}
                        className="remove-cat-btn"
                        title="Supprimer la catégorie"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="add-category-row">
                  <input
                    type="text"
                    placeholder="Nom de la nouvelle catégorie..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCategory();
                      }
                    }}
                  />
                  <button type="button" onClick={addCategory} className="add-cat-btn">
                    <Plus size={16} />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>

              {/* Top Offer Section (Home Page Banner) */}
              <div className="settings-section-card">
                <h3><Zap size={18} /> Offre Promotionnelle (En-tête Accueil)</h3>
                <p className="settings-sub-text">
                  Configurez la bannière promotionnelle en tête de la page d'accueil pour rediriger vos clients vers un produit phare.
                </p>

                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={settingsForm.offerEnabled}
                    onChange={(e) => setSettingsForm((p) => ({ ...p, offerEnabled: e.target.checked }))}
                  />
                  <span>Activer la bannière d'offre sur la page d'accueil</span>
                </label>

                {settingsForm.offerEnabled && (
                  <div className="settings-grid mt-2">
                    <div className="settings-field">
                      <label>Badge (ex: OFFRE DU MOMENT, VENTE FLASH)</label>
                      <input
                        type="text"
                        value={settingsForm.offerBadge}
                        onChange={(e) => setSettingsForm((p) => ({ ...p, offerBadge: e.target.value }))}
                        placeholder="OFFRE DU MOMENT"
                      />
                    </div>
                    <div className="settings-field">
                      <label>Remise affichée (ex: -20%, PROMO)</label>
                      <input
                        type="text"
                        value={settingsForm.offerDiscount}
                        onChange={(e) => setSettingsForm((p) => ({ ...p, offerDiscount: e.target.value }))}
                        placeholder="-25%"
                      />
                    </div>
                    <div className="settings-field full-w">
                      <label>Titre de l'offre</label>
                      <input
                        type="text"
                        value={settingsForm.offerTitle}
                        onChange={(e) => setSettingsForm((p) => ({ ...p, offerTitle: e.target.value }))}
                        placeholder="Ex: Réduction exceptionnelle sur notre nouveau produit"
                      />
                    </div>
                    <div className="settings-field full-w">
                      <label>Sous-titre / Description de l'offre</label>
                      <input
                        type="text"
                        value={settingsForm.offerSubtitle}
                        onChange={(e) => setSettingsForm((p) => ({ ...p, offerSubtitle: e.target.value }))}
                        placeholder="Ex: Quantités limitées. Livraison express 58 wilayas."
                      />
                    </div>
                    <div className="settings-field">
                      <label>ID du produit lié (au clic)</label>
                      <input
                        type="number"
                        value={settingsForm.offerProductId}
                        onChange={(e) => setSettingsForm((p) => ({ ...p, offerProductId: e.target.value }))}
                        placeholder="Ex: 1"
                      />
                    </div>
                    <div className="settings-field full-w">
                      <label>Image de l'offre promotionnelle</label>
                      <div className="image-input-group">
                        <input
                          type="text"
                          value={settingsForm.offerImage}
                          onChange={(e) => setSettingsForm((p) => ({ ...p, offerImage: e.target.value }))}
                          placeholder="https://images.unsplash.com/... ou choisir depuis l'appareil"
                          className="image-url-input"
                        />
                        <span className="or-text">ou</span>
                        <button
                          type="button"
                          className="upload-file-btn"
                          onClick={() => offerImageFileRef.current?.click()}
                          disabled={isUploadingOfferImage}
                        >
                          <Upload size={16} />
                          <span>{isUploadingOfferImage ? 'Téléchargement...' : 'Choisir depuis l\'appareil'}</span>
                        </button>
                        <input
                          type="file"
                          ref={offerImageFileRef}
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleOfferImageUpload(e.target.files?.[0])}
                        />
                      </div>
                      {settingsForm.offerImage && (
                        <div style={{ marginTop: '8px' }}>
                          <img
                            src={settingsForm.offerImage}
                            alt="Aperçu de l'offre"
                            style={{ width: '140px', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* SEO & Keywords Section */}
              <div className="settings-section-card">
                <h3><Globe size={18} /> Référencement &amp; Mots-clés (SEO Google)</h3>
                <p className="settings-sub-text">
                  Optimisez l'affichage de votre boutique sur Google et les moteurs de recherche.
                </p>

                <div className="settings-grid">
                  <div className="settings-field full-w">
                    <label>Titre Meta (Balise &lt;title&gt;)</label>
                    <input
                      type="text"
                      value={settingsForm.seoMetaTitle}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, seoMetaTitle: e.target.value }))}
                      placeholder="Ex: AURA Commerce | Boutique en ligne Algérie - Paiement à la livraison"
                    />
                  </div>
                  <div className="settings-field full-w">
                    <label>Description Meta (&lt;meta name="description"&gt;)</label>
                    <textarea
                      rows={3}
                      value={settingsForm.seoMetaDescription}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, seoMetaDescription: e.target.value }))}
                      placeholder="Ex: Achetez vos vêtements, écouteurs et accessoires en ligne en Algérie. Livraison 58 Wilayas."
                    />
                  </div>
                  <div className="settings-field full-w">
                    <label>Mots-clés SEO (Keywords séparés par des virgules)</label>
                    <textarea
                      rows={3}
                      value={settingsForm.seoKeywords}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, seoKeywords: e.target.value }))}
                      placeholder="Ex: achat en ligne, e-commerce algérie, vêtements, écouteurs, livraison 58 wilayas, dzd, paiement à la livraison"
                    />
                  </div>
                </div>
              </div>

              {/* Save Settings Buttons */}
              <div className="settings-save-row">
                <button
                  type="submit"
                  className="save-settings-btn"
                  disabled={isSavingSettings}
                >
                  {isSavingSettings ? 'Enregistrement en cours...' : '💾 Sauvegarder les paramètres'}
                </button>
                <button
                  type="button"
                  onClick={resetSiteSettings}
                  className="admin-reset-btn"
                >
                  Réinitialiser
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==========================================
            TAB 4: SECURITY
           ========================================== */}
        {activeTab === 'security' && (
          <div className="security-tab">
            <h2><KeyRound size={22} /> Paramètres de Sécurité de l'Administrateur</h2>
            <p className="admin-sub">
              Modifiez le nom d'utilisateur et le mot de passe de votre compte admin.
            </p>

            <form onSubmit={handleSaveSecurity} className="security-form">
              <div className="settings-section-card">
                <h3>Identifiants d'accès</h3>

                <div className="settings-grid">
                  <div className="settings-field full-w">
                    <label>Mot de passe actuel <span className="req">*</span></label>
                    <div className="input-field-wrapper">
                      <Lock size={16} className="field-icon" />
                      <input
                        type="password"
                        value={securityForm.currentPassword}
                        onChange={(e) => setSecurityForm((p) => ({ ...p, currentPassword: e.target.value }))}
                        placeholder="Saisissez votre mot de passe actuel..."
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  <div className="settings-field">
                    <label>Nouveau nom d'utilisateur (Optionnel)</label>
                    <div className="input-field-wrapper">
                      <User size={16} className="field-icon" />
                      <input
                        type="text"
                        value={securityForm.newUsername}
                        onChange={(e) => setSecurityForm((p) => ({ ...p, newUsername: e.target.value }))}
                        placeholder="Nouveau username..."
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="settings-field">
                    <label>Nouveau mot de passe (Optionnel)</label>
                    <div className="input-field-wrapper">
                      <Lock size={16} className="field-icon" />
                      <input
                        type="password"
                        value={securityForm.newPassword}
                        onChange={(e) => setSecurityForm((p) => ({ ...p, newPassword: e.target.value }))}
                        placeholder="Nouveau mot de passe..."
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div className="settings-field full-w">
                    <label>Confirmer le nouveau mot de passe</label>
                    <div className="input-field-wrapper">
                      <Lock size={16} className="field-icon" />
                      <input
                        type="password"
                        value={securityForm.confirmPassword}
                        onChange={(e) => setSecurityForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                        placeholder="Confirmez le nouveau mot de passe..."
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {securityMsg && (
                <div className={`security-msg ${securityMsg.startsWith('✅') ? 'success' : 'error'}`}>
                  {securityMsg}
                </div>
              )}

              <button
                type="submit"
                className="save-settings-btn"
                disabled={isSavingSecurity}
              >
                {isSavingSecurity ? 'Mise à jour en cours...' : '🔐 Mettre à jour les accès admin'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ==========================================
          MODAL: ADD / EDIT PRODUCT
         ========================================== */}
      {isProductModalOpen && (
        <div className="modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}</h2>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="modal-close-btn"
                aria-label="Fermer la modal"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="modal-form">
              {/* Basic Fields */}
              <div className="modal-section">
                <h4>Informations Principales</h4>
                <div className="modal-grid">
                  <div className="modal-field full-w">
                    <label>Nom du Produit <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Ex: T-Shirt Premium Coton Noir"
                    />
                  </div>

                  <div className="modal-field full-w">
                    <label>Slogan court (Tagline)</label>
                    <input
                      type="text"
                      value={productForm.tagline}
                      onChange={(e) => setProductForm((p) => ({ ...p, tagline: e.target.value }))}
                      placeholder="Ex: 100% Coton peigné, coupe moderne"
                    />
                  </div>

                  <div className="modal-field">
                    <label>Catégorie <span className="req">*</span></label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))}
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="modal-field">
                    <label>Quantité en stock</label>
                    <input
                      type="number"
                      value={productForm.stockCount}
                      onChange={(e) => setProductForm((p) => ({ ...p, stockCount: e.target.value }))}
                      min="0"
                    />
                  </div>

                  <div className="modal-field">
                    <label>Prix (DZD) <span className="req">*</span></label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
                      placeholder="Ex: 3500"
                      min="0"
                    />
                  </div>

                  <div className="modal-field">
                    <label>Prix barré / Promo (DZD)</label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm((p) => ({ ...p, originalPrice: e.target.value }))}
                      placeholder="Ex: 4800"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Main Product Image */}
              <div className="modal-section">
                <h4>Image Principale du Produit</h4>
                <div className="image-upload-area">
                  {productForm.image && (
                    <img
                      src={productForm.image}
                      alt="Prévisualisation"
                      className="image-preview-thumb"
                    />
                  )}
                  <div className="image-input-group">
                    <input
                      type="text"
                      placeholder="URL directe de l'image (https://...)"
                      value={productForm.image}
                      onChange={(e) => setProductForm((p) => ({ ...p, image: e.target.value }))}
                      className="image-url-input"
                    />
                    <span className="or-text">ou</span>
                    <button
                      type="button"
                      className="upload-file-btn"
                      onClick={() => imageFileRef.current?.click()}
                      disabled={isUploadingImage}
                    >
                      <Upload size={16} />
                      <span>{isUploadingImage ? 'Chargement...' : 'Choisir depuis l\'appareil'}</span>
                    </button>
                    <input
                      type="file"
                      ref={imageFileRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleDeviceImageUpload(e.target.files?.[0])}
                    />
                  </div>
                </div>
              </div>

              {/* Product Colors Management */}
              <div className="modal-section">
                <h4><Palette size={16} /> Déclinaisons de Couleurs &amp; Photos par Couleur</h4>
                <p className="modal-sub-text">
                  Pour les vêtements, écouteurs ou produits à couleurs multiples, ajoutez chaque couleur avec sa propre photo.
                </p>

                {productForm.colors.length > 0 && (
                  <div className="colors-list-preview">
                    {productForm.colors.map((c, idx) => (
                      <div key={idx} className="color-preview-item">
                        <span
                          className="color-dot-preview"
                          style={{ backgroundColor: c.hex || c.code || '#000' }}
                        />
                        <span className="color-preview-name">{c.name}</span>
                        {c.image && (
                          <img src={c.image} alt={c.name} className="color-img-thumb" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeColorFromProduct(idx)}
                          className="remove-color-btn"
                          title="Supprimer cette couleur"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="add-color-row">
                  <input
                    type="text"
                    placeholder="Nom (ex: Rouge, Noir, Bleu)"
                    value={newColor.name}
                    onChange={(e) => setNewColor((p) => ({ ...p, name: e.target.value }))}
                    className="color-name-input"
                  />
                  <input
                    type="color"
                    value={newColor.hex}
                    onChange={(e) => setNewColor((p) => ({ ...p, hex: e.target.value }))}
                    className="color-hex-input"
                    title="Choisir le code couleur"
                  />
                  <input
                    type="text"
                    placeholder="URL photo pour cette couleur..."
                    value={newColor.image}
                    onChange={(e) => setNewColor((p) => ({ ...p, image: e.target.value }))}
                    className="color-img-input"
                  />
                  <button
                    type="button"
                    onClick={() => colorImageRef.current?.click()}
                    className="upload-file-btn small"
                    disabled={colorImageUploading}
                  >
                    <Upload size={14} />
                    <span>{colorImageUploading ? '...' : 'Photo appareil'}</span>
                  </button>
                  <input
                    type="file"
                    ref={colorImageRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleColorImageUpload(e.target.files?.[0])}
                  />
                  <button
                    type="button"
                    onClick={addColorToProduct}
                    className="add-color-btn"
                  >
                    <Plus size={15} />
                    <span>Ajouter couleur</span>
                  </button>
                </div>
              </div>

              {/* Description & Features */}
              <div className="modal-section">
                <h4>Description &amp; Caractéristiques</h4>
                <div className="modal-field full-w">
                  <label>Description détaillée</label>
                  <textarea
                    rows={4}
                    value={productForm.description}
                    onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Description complète pour informer le client..."
                  />
                </div>
                <div className="modal-field full-w">
                  <label>Points forts (1 par ligne)</label>
                  <textarea
                    rows={4}
                    value={productForm.featuresText}
                    onChange={(e) => setProductForm((p) => ({ ...p, featuresText: e.target.value }))}
                    placeholder="Tissu respirant&#10;Lavable en machine&#10;Garantie 1 an&#10;..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="modal-cancel-btn"
                >
                  Annuler
                </button>
                <button type="submit" className="modal-save-btn">
                  {editingProduct ? '💾 Enregistrer les modifications' : '➕ Ajouter au catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
