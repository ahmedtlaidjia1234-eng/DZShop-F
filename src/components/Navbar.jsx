import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, ShieldCheck, Globe } from 'lucide-react';
import { useCart } from '../context/useCart';
import { useStore } from '../context/useStore';
import { useLanguage } from '../context/useLanguage';

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const { siteSettings } = useStore();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith('/admin');

  const langs = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'عربي' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      {siteSettings.showAnnouncement && siteSettings.announcement && !isAdminPage && (
        <div className="top-announcement-bar">
          <p>{siteSettings.announcement}</p>
        </div>
      )}

      <header className="navbar-header">
        <div className="navbar-container">
          {/* Dynamic Brand / Logo */}
          <Link to="/" className="brand-logo">
            <div className="logo-icon-wrapper">
              <ShoppingBag className="logo-icon" size={22} />
            </div>
            <div className="brand-text">
              <span className="brand-title">{siteSettings.siteName || 'AURA'}</span>
              <span className="brand-subtitle">{siteSettings.siteSubtitle || 'COMMERCE'}</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              {t('navHome')}
            </Link>
            <a
              href="/#products"
              className="nav-link"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  const elem = document.getElementById('products-section');
                  if (elem) {
                    elem.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            >
              {t('navProducts')}
            </a>
            <Link
              to="/admin"
              className={`nav-link admin-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              <ShieldCheck size={16} />
              <span>{t('navAdmin')}</span>
            </Link>
          </nav>

          {/* Right Actions: Language Switcher + Cart Button */}
          <div className="nav-actions">
            {/* Language Switcher */}
            <div className="lang-switcher" aria-label="Choisir la langue">
              <Globe size={15} className="lang-globe-icon" />
              {langs.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`lang-btn ${language === l.code ? 'active' : ''}`}
                  title={l.code.toUpperCase()}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {!isAdminPage && (
              <button
                onClick={openCart}
                className="cart-toggle-btn"
                aria-label="Voir le panier"
              >
                <ShoppingCart size={20} />
                <span className="cart-text">{t('navCart')}</span>
                {totalItems > 0 && (
                  <span className="cart-badge-count">{totalItems}</span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
