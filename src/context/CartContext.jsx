import { useState, useEffect } from 'react';
import { CartContext } from './CartContextInstance';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cartItems]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2800);
  };

  const addToCart = (product, quantity = 1, selectedColor = null) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find(
        (item) =>
          item.product.id === product.id &&
          (item.selectedColor?.name || null) === (selectedColor?.name || null)
      );
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id &&
          (item.selectedColor?.name || null) === (selectedColor?.name || null)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity, selectedColor }];
    });
    showToast(`"${product.name}" ajouté au panier !`);
  };

  const removeFromCart = (productId, selectedColor = null) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (item.selectedColor?.name || null) === (selectedColor?.name || null)
          )
      )
    );
  };

  const updateQuantity = (productId, newQuantity, selectedColor = null) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId &&
        (item.selectedColor?.name || null) === (selectedColor?.name || null)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        openCart,
        closeCart,
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
