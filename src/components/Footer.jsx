import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones, Lock } from 'lucide-react';
import { useStore } from '../context/useStore';
import { useLanguage } from '../context/useLanguage';

const currentYear = new Date().getFullYear();

export default function Footer() {
  const { siteSettings } = useStore();
  const { t, language } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-benefits-bar">
        <div className="footer-container benefits-grid">
          <div className="benefit-item">
            <Truck className="benefit-icon" size={24} />
            <div>
              <h4>{t('deliveryTo58Wilayas')}</h4>
              <p>{language === 'ar' ? 'دفع آمن باليد عند الاستلام' : 'Paiement sécurisé à la livraison'}</p>
            </div>
          </div>
          <div className="benefit-item">
            <ShieldCheck className="benefit-icon" size={24} />
            <div>
              <h4>{t('warranty')}</h4>
              <p>{language === 'ar' ? '100% منتجات أصلية ومضمونة' : '100% produits de qualité certifiée'}</p>
            </div>
          </div>
          <div className="benefit-item">
            <RotateCcw className="benefit-icon" size={24} />
            <div>
              <h4>{t('returns')}</h4>
              <p>{language === 'ar' ? 'إرجاع واستبدال في غاية السهولة' : 'Échange simple et rapide'}</p>
            </div>
          </div>
          <div className="benefit-item">
            <Headphones className="benefit-icon" size={24} />
            <div>
              <h4>{t('customerSupport')}</h4>
              <p>{siteSettings.contactEmail || 'contact@auracommerce.com'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-container footer-content-row">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <ShoppingBag size={20} />
              <span>{siteSettings.siteName} {siteSettings.siteSubtitle}</span>
            </div>
            <p className="footer-description">
              {siteSettings.siteTagline ||
                (language === 'ar' ? 'متجرك الإلكتروني المفضل في الجزائر - توصيل متاح لـ 58 ولاية والدفع نقداً عند استلام طلبك.' : 'Boutique en ligne en Algérie - Livraison disponible vers 58 Wilayas avec paiement en espèces à la livraison.')}
            </p>
          </div>

          <div className="footer-links-col">
            <h5>{t('navHome')}</h5>
            <ul>
              <li><Link to="/">{t('navHome')}</Link></li>
              <li><a href="/#products">{t('navProducts')}</a></li>
              <li><Link to="/checkout">{t('proceedToCheckout')}</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h5>{t('navAdmin')}</h5>
            <ul>
              <li>
                <Link to="/admin" className="admin-footer-link">
                  <Lock size={13} />
                  <span>{t('navAdmin')}</span>
                </Link>
              </li>
              <li><span className="footer-category-link">{siteSettings.contactEmail}</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container bottom-flex">
          <p>© {currentYear} {siteSettings.siteName} {siteSettings.siteSubtitle}. Tous droits réservés.</p>
          <p className="built-with">E-Commerce Algérie (DZD)</p>
        </div>
      </div>
    </footer>
  );
}
