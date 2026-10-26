import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  ArrowLeft,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
  PackageCheck
} from 'lucide-react';
import { useCart } from '../context/useCart';
import { useStore } from '../context/useStore';
import { useLanguage } from '../context/useLanguage';
import ProductCard from '../components/ProductCard';
import SEOHead from '../components/SEOHead';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products } = useStore();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const product = products.find((p) => p.id === parseInt(id, 10));

  if (!product) {
    return (
      <div className="product-not-found-container">
        <div className="container text-center">
          <h2>{t('noProductsFound')}</h2>
          <p>Le produit recherché n'existe pas ou a été retiré.</p>
          <Link to="/" className="back-home-btn">
            <ArrowLeft size={18} />
            <span>{t('returnShop')}</span>
          </Link>
        </div>
      </div>
    );
  }

  return <ProductDetailContent key={product.id} product={product} />;
}

function ProductDetailContent({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, siteSettings } = useStore();
  const { t, language } = useLanguage();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(() =>
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );

  const activeImage = selectedColor?.image || product.image;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, 3);

  const currency = siteSettings.currency || 'DZD';
  const formattedPrice = Number(product.price).toLocaleString();
  const formattedOriginalPrice = product.originalPrice
    ? Number(product.originalPrice).toLocaleString()
    : null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    navigate('/checkout');
  };

  const isOutOfStock = (product.stockCount ?? 1) <= 0;

  return (
    <div className="product-detail-page">
      <SEOHead
        title={product.name}
        description={product.description || product.tagline}
        image={activeImage}
        product={product}
      />

      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="detail-navigation-bar">
          <button onClick={() => navigate(-1)} className="back-nav-btn">
            <ArrowLeft size={18} />
            <span>{t('returnShop')}</span>
          </button>

          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">{t('navHome')}</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{product.category}</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current active">{product.name}</span>
          </nav>
        </div>

        {/* Main Product Showcase Section */}
        <div className="product-detail-grid">
          {/* Left Column: Image with dynamic color switcher */}
          <div className="product-gallery-column">
            <div className="main-image-wrapper">
              <img
                src={activeImage}
                alt={product.name}
                className="main-product-image"
              />
              {discountPercent && (
                <div className="detail-badge-discount">-{discountPercent}%</div>
              )}
              <div className={`detail-stock-badge ${isOutOfStock ? 'out-badge' : ''}`}>
                <PackageCheck size={16} />
                <span>
                  {isOutOfStock
                    ? t('outOfStock')
                    : t('inStock', { count: product.stockCount })}
                </span>
              </div>
            </div>

            {/* If product has colors with custom images, show thumbnail gallery */}
            {product.colors && product.colors.length > 1 && (
              <div className="product-thumbnails-gallery">
                {product.colors.map((col, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`thumb-btn ${selectedColor?.name === col.name ? 'active' : ''}`}
                    title={col.name}
                  >
                    <img src={col.image || product.image} alt={col.name} />
                    <span
                      className="thumb-color-dot"
                      style={{ backgroundColor: col.hex || col.code || '#000' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info & Actions */}
          <div className="product-info-column">
            <div className="detail-category-label">{product.category}</div>
            <h1 className="detail-product-title">{product.name}</h1>
            <p className="detail-tagline">{product.tagline}</p>

            {/* Price Box */}
            <div className="detail-price-box">
              <span className="detail-current-price">
                {formattedPrice} {currency}
              </span>
              {formattedOriginalPrice && (
                <span className="detail-original-price">
                  {formattedOriginalPrice} {currency}
                </span>
              )}
              {discountPercent && (
                <span className="detail-savings-tag">
                  {t('saving')} {(product.originalPrice - product.price).toLocaleString()} {currency}
                </span>
              )}
            </div>

            {/* Colors Section */}
            {product.colors && product.colors.length > 0 && (
              <div className="detail-colors-selector-box">
                <div className="colors-header">
                  <h4>{t('colors')} :</h4>
                  <strong className="selected-color-name">
                    {selectedColor?.name || product.colors[0]?.name}
                  </strong>
                </div>
                <div className="color-swatches-list">
                  {product.colors.map((col, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`color-choice-pill ${
                        selectedColor?.name === col.name ? 'selected' : ''
                      }`}
                    >
                      <span
                        className="color-circle"
                        style={{ backgroundColor: col.hex || col.code || '#000' }}
                      />
                      <span>{col.name}</span>
                      {selectedColor?.name === col.name && (
                        <Check size={14} className="color-check-icon" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="detail-description">
              <p>{product.description}</p>
            </div>

            {/* Highlights */}
            {product.features && product.features.length > 0 && (
              <div className="detail-features-box">
                <h4>{t('features')}</h4>
                <ul className="features-list">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="feature-item">
                      <div className="feature-icon-bullet">
                        <Check size={14} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="detail-specs-box">
                <h4>{t('specs')}</h4>
                <div className="specs-table">
                  {Object.entries(product.specs).map(([specKey, specVal]) => (
                    <div key={specKey} className="spec-row">
                      <span className="spec-label">{specKey}</span>
                      <span className="spec-val">{specVal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Purchasing Controls */}
            <div className="purchase-action-container">
              <div className="quantity-selection-wrapper">
                <span className="quantity-label">{t('quantity')} :</span>
                <div className="quantity-selector">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="qty-selector-btn"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="qty-number">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stockCount || 99, q + 1))
                    }
                    disabled={quantity >= (product.stockCount || 99) || isOutOfStock}
                    className="qty-selector-btn"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons-group">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="add-to-cart-large-btn"
                >
                  <ShoppingCart size={20} />
                  <span>{isOutOfStock ? t('outOfStock') : t('addToCart')}</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="buy-now-large-btn"
                >
                  <Zap size={20} />
                  <span>{t('buyNow')}</span>
                </button>
              </div>
            </div>

            {/* Delivery & Security Badges (Free delivery removed) */}
            <div className="detail-guarantees-grid">
              <div className="guarantee-box">
                <Truck size={20} className="guarantee-icon" />
                <div>
                  <strong>{t('deliveryTo58Wilayas')}</strong>
                  <p>{language === 'ar' ? 'توصيل سريع حتى باب المنزل' : 'Livraison à domicile rapide'}</p>
                </div>
              </div>
              <div className="guarantee-box">
                <ShieldCheck size={20} className="guarantee-icon" />
                <div>
                  <strong>{t('cashOnDeliveryOnly')}</strong>
                  <p>{language === 'ar' ? 'ادفع نقداً بعد استلام الطرد' : 'Payez en liquide à la réception'}</p>
                </div>
              </div>
              <div className="guarantee-box">
                <RotateCcw size={20} className="guarantee-icon" />
                <div>
                  <strong>{t('returns')}</strong>
                  <p>{language === 'ar' ? 'استبدال سريع وسهل' : 'Échange rapide garanti'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <section className="related-products-section">
            <div className="related-header">
              <h2 className="related-title">{t('relatedProducts')}</h2>
            </div>
            <div className="products-grid">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
