import { useState, useEffect } from 'react';
import { LanguageContext } from './LanguageContextInstance';
import { translations } from '../i18n/translations';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_lang');
      return saved && ['en', 'fr', 'ar'].includes(saved) ? saved : 'ar';
    } catch {
      return 'ar';
    }
  });

  const setLanguage = (lang) => {
    if (['en', 'fr', 'ar'].includes(lang)) {
      setLanguageState(lang);
      try {
        localStorage.setItem('aura_lang', lang);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    if (language === 'ar') {
      document.body.classList.add('arabic-dir');
    } else {
      document.body.classList.remove('arabic-dir');
    }
  }, [language]);

  const t = (key, params = {}) => {
    const dict = translations[language] || translations.en;
    let text = dict[key] || translations.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
