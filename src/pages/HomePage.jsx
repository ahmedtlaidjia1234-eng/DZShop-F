import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Zap, Tag } from 'lucide-react';
import { useStore } from '../context/useStore';
import { useLanguage } from '../context/useLanguage';
import ProductCard from '../components/ProductCard';
import SEOHead from '../components/SEOHead';

export default function HomePage() {
  const { products, siteSettings } = useStore();
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Extract unique categories from current store products and settings
  const categories = useMemo(() => {
    const list = new Set(['All']);
    if (Array.isArray(siteSettings.categories)) {
      siteSettings.categories.forEach((cat) => list.add(cat));
    }
    products.forEach((p) => {
      if (p.category) list.add(p.category);
    });
    return Array.from(list);
  }, [products, siteSettings.categories]);

  // Filter and sort products (No rating filter/sort)
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        (product.description && product.description.toLowerCase().includes(q)) ||
        (product.tagline && product.tagline.toLowerCase().includes(q)) ||
        product.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const showOffer =
    siteSettings.offerEnabled &&
    siteSettings.offerTitle &&
    siteSettings.offerProductId;

  return (
    <>
      <SEOHead />
      <div className="home-page-container">

        {/* Dynamic Promotional Offer Banner at the Top (Admin Editable) */}
        {showOffer && (
          <section className="offer-banner-section" aria-label="Offre promotionnelle">
            <div className="offer-banner-inner">
              {siteSettings.offerImage && (
                <div className="offer-banner-img-col">
                  <img
                    src={siteSettings.offerImage}
                    alt={siteSettings.offerTitle}
                    className="offer-banner-img"
                  />
                </div>
              )}
              <div className="offer-banner-content">
                <div className="offer-badges-row">
                  {siteSettings.offerBadge && (
                    <div className="offer-badge-pill">
                      <Zap size={14} />
                      <span>{siteSettings.offerBadge}</span>
                    </div>
                  )}
                  {siteSettings.offerDiscount && (
                    <div className="offer-discount-tag">
                      <Tag size={16} />
                      <span>{siteSettings.offerDiscount}</span>
                    </div>
                  )}
                </div>

                <h2 className="offer-banner-title">{siteSettings.offerTitle}</h2>
                {siteSettings.offerSubtitle && (
                  <p className="offer-banner-subtitle">{siteSettings.offerSubtitle}</p>
                )}

                <Link
                  to={`/product/${siteSettings.offerProductId}`}
                  className="offer-cta-btn"
                >
                  {t('offerCta')}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Products Section */}
        <section id="products-section" className="products-showcase-section">
          <div className="container">
            <div className="section-header-block">
              <div className="section-badge">{language === 'ar' ? 'الجزائر · 58 ولاية' : 'Algérie · 58 Wilayas'}</div>
              <h1 className="section-title">{t('navProducts')}</h1>
              <p className="section-subtitle">
                {siteSettings.siteTagline ||
                  (language === 'ar' ? 'تصفح تشكيلة منتجاتنا المميزة مع خدمة التوصيل السريع لـ 58 ولاية والدفع عند الاستلام.' : 'Découvrez notre catalogue exclusif disponible en livraison rapide vers 58 wilayas.')}
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="filter-controls-bar">
              {/* Category Pills */}
              <div className="category-pills">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
                  >
                    {category === 'All' ? t('allCategories') : category}
                  </button>
                ))}
              </div>

              {/* Search & Sort Controls */}
              <div className="search-sort-group">
                <div className="search-input-wrapper">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="clear-search-btn"
                      title="Effacer la recherche"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="sort-wrapper">
                  <SlidersHorizontal size={16} className="sort-icon" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="featured">{t('featured')}</option>
                    <option value="price-low">{t('priceLowHigh')}</option>
                    <option value="price-high">{t('priceHighLow')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results stats */}
            <div className="results-count-row">
              <span>
                {t('productsCount', { count: filteredProducts.length })}
                {selectedCategory !== 'All' ? ` — "${selectedCategory}"` : ''}
                {searchQuery ? ` — "${searchQuery}"` : ''}
              </span>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-products-found">
                <h3>{t('noProductsFound')}</h3>
                <p>Aucun article ne correspond à votre recherche ou catégorie sélectionnée.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="reset-filters-btn"
                >
                  {t('resetFilters')}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
