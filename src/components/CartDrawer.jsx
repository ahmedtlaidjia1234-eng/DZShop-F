import { useNavigate, Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/useCart';
import { useLanguage } from '../context/useLanguage';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    isCartOpen,
    closeCart,
    cartItems,
    removeFromCart,
    updateQuantity,
    totalPrice,
    clearCart,
  } = useCart();
  const { t } = useLanguage();

  if (!isCartOpen) return null;

  const handleGoToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const formatPrice = (price) => `${Number(price || 0).toLocaleString()} DZD`;

  return (
    <div className="cart-backdrop" onClick={closeCart}>
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Shopping Cart Drawer"
      >
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingBag size={20} />
            <h2>{t('cartTitle')} ({cartItems.length})</h2>
          </div>
          <button
            onClick={closeCart}
            className="cart-close-btn"
            aria-label="Fermer le panier"
          >
            <X size={20} />
          </button>
        </div>

        {/* Empty State */}
        {cartItems.length === 0 ? (
          <div className="empty-cart-state">
            <ShoppingBag size={64} className="empty-icon" />
            <h3>{t('emptyCart')}</h3>
            <p>{t('emptyCartPrompt')}</p>
            <button onClick={closeCart} className="continue-shopping-btn">
              {t('continueShopping')}
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="cart-items-list">
              {cartItems.map(({ product, quantity, selectedColor }) => {
                const itemKey = `${product.id}-${selectedColor?.name || 'default'}`;
                const itemImage = selectedColor?.image || product.image;
                return (
                  <div key={itemKey} className="cart-item-row">
                    <Link
                      to={`/product/${product.id}`}
                      onClick={closeCart}
                      className="cart-item-image-wrapper"
                    >
                      <img
                        src={itemImage}
                        alt={product.name}
                        className="cart-item-image"
                      />
                    </Link>
                    <div className="cart-item-details">
                      <Link
                        to={`/product/${product.id}`}
                        onClick={closeCart}
                        className="cart-item-title"
                      >
                        {product.name}
                      </Link>
                      <div className="cart-item-category">{product.category}</div>

                      {selectedColor && (
                        <div className="cart-item-color-badge">
                          <span
                            className="cart-color-dot"
                            style={{ backgroundColor: selectedColor.hex || selectedColor.code || '#888' }}
                          />
                          <span>{selectedColor.name}</span>
                        </div>
                      )}

                      <div className="cart-item-price-row">
                        <span className="cart-item-price">
                          {formatPrice(product.price * quantity)}
                        </span>
                        <span className="cart-item-unit-price">
                          ({formatPrice(product.price)} / {t('each')})
                        </span>
                      </div>

                      <div className="cart-item-controls">
                        <div className="quantity-adjuster">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1, selectedColor)}
                            className="qty-btn"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="qty-value">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1, selectedColor)}
                            className="qty-btn"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id, selectedColor)}
                          className="remove-item-btn"
                          title="Supprimer du panier"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary */}
            <div className="cart-footer">
              <div className="cart-summary-line">
                <span>{t('subtotal')}</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="cart-summary-line">
                <span>{t('deliveryFee')}</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {t('calculatedAtCheckout')}
                </span>
              </div>
              <div className="cart-summary-line total">
                <span>{t('total')}</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <button type="button" onClick={handleGoToCheckout} className="checkout-btn">
                <span>{t('proceedToCheckout')}</span>
                <ArrowRight size={18} />
              </button>

              <button type="button" onClick={clearCart} className="clear-cart-btn">
                {t('clearCart')}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
