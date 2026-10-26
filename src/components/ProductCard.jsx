import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/useCart';
import { useStore } from '../context/useStore';
import { useLanguage } from '../context/useLanguage';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { siteSettings } = useStore();
  const { t } = useLanguage();

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const currency = siteSettings.currency || 'DZD';
  const formattedPrice = Number(product.price).toLocaleString();
  const formattedOriginalPrice = product.originalPrice
    ? Number(product.originalPrice).toLocaleString()
    : null;

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-image-link">
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-card-image"
            loading="lazy"
          />
          {discountPercent && (
            <span className="discount-tag">-{discountPercent}%</span>
          )}
          <span className="category-tag">{product.category}</span>
        </div>
      </Link>

      <div className="product-card-body">
        {/* Color swatches preview if product has colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="card-color-swatches">
            {product.colors.slice(0, 5).map((col, idx) => (
              <span
                key={idx}
                className="card-color-dot"
                style={{ backgroundColor: col.hex || col.code || '#000' }}
                title={col.name}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="card-color-more">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        <h3 className="product-card-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        <p className="product-card-tagline">{product.tagline}</p>

        <div className="product-card-footer">
          <div className="price-container">
            <span className="current-price">
              {formattedPrice} {currency}
            </span>
            {formattedOriginalPrice && (
              <span className="original-price">
                {formattedOriginalPrice} {currency}
              </span>
            )}
          </div>

          <div className="card-action-buttons">
            <Link
              to={`/product/${product.id}`}
              className="view-details-btn"
              title={t('details')}
            >
              <Eye size={16} />
              <span>{t('details')}</span>
            </Link>
            <button
              onClick={() => addToCart(product, 1)}
              className="add-to-cart-btn"
              title={t('addToCart')}
            >
              <ShoppingCart size={16} />
              <span>{t('add')}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
