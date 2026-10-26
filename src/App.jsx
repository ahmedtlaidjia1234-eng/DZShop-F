import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  return (
    <Router>
      <StoreProvider>
        <LanguageProvider>
          <CartProvider>
            <div className="app-layout">
              {/* Top Sticky Navbar with Language Switcher */}
              <Navbar />

              {/* Main Routing Views */}
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Global Shopping Cart Slide Drawer */}
              <CartDrawer />

              {/* Global Toast Notification */}
              <Toast />

              {/* Bottom Footer */}
              <Footer />
            </div>
          </CartProvider>
        </LanguageProvider>
      </StoreProvider>
    </Router>
  );
}
