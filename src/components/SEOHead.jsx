import { useEffect } from 'react';
import { useStore } from '../context/useStore';

export default function SEOHead({
  title,
  description,
  keywords,
  image,
  product,
}) {
  const { siteSettings } = useStore();

  useEffect(() => {
    // 1. Document Title
    const finalTitle = title
      ? `${title} | ${siteSettings.siteName || 'AURA'}`
      : siteSettings.seoMetaTitle || `${siteSettings.siteName} ${siteSettings.siteSubtitle} | E-Commerce Algérie`;

    document.title = finalTitle;

    // Helper to create or update meta tags
    const setMetaTag = (name, content, isProperty = false) => {
      if (!content) return;
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        if (isProperty) {
          tag.setAttribute('property', name);
        } else {
          tag.setAttribute('name', name);
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // 2. Meta Description & Keywords
    const finalDescription =
      description ||
      siteSettings.seoMetaDescription ||
      siteSettings.siteTagline ||
      'Achetez en ligne en Algérie avec paiement à la livraison sur les 58 wilayas.';

    const finalKeywords =
      keywords ||
      siteSettings.seoKeywords ||
      'achat en ligne, e-commerce algerie, dzd, dinar algerien, livraison 58 wilayas, paiement a la livraison';

    setMetaTag('description', finalDescription);
    setMetaTag('keywords', finalKeywords);

    // 3. OpenGraph Tags (Facebook, WhatsApp, LinkedIn)
    setMetaTag('og:title', finalTitle, true);
    setMetaTag('og:description', finalDescription, true);
    setMetaTag('og:type', product ? 'product' : 'website', true);
    setMetaTag('og:site_name', siteSettings.siteName || 'AURA Commerce', true);
    setMetaTag('og:image', image || product?.image || siteSettings.offerImage || '/favicon.svg', true);
    setMetaTag('og:url', window.location.href, true);

    // 4. Twitter Card Tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', finalTitle);
    setMetaTag('twitter:description', finalDescription);
    setMetaTag('twitter:image', image || product?.image || siteSettings.offerImage || '/favicon.svg');

    // 5. JSON-LD Structured Data Schema for Google Search
    let scriptTag = document.getElementById('schema-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = product
      ? {
          '@context': 'https://schema.org/',
          '@type': 'Product',
          name: product.name,
          image: [product.image],
          description: product.description || product.tagline,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'DZD',
            price: product.price,
            availability:
              product.stockCount > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            priceValidUntil: '2027-12-31',
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteSettings.siteName || 'AURA Commerce',
          url: window.location.origin,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${window.location.origin}/?search={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        };

    scriptTag.text = JSON.stringify(schemaData);
  }, [title, description, keywords, image, product, siteSettings]);

  return null;
}
