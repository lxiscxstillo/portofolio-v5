import React, { createContext, useContext, useState, useCallback } from 'react';
import en from '../i18n/en.json';
import es from '../i18n/es.json';

const translations = { en, es };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem('portfolio-lang');
    if (stored) return stored;
    if (typeof navigator !== 'undefined' && navigator.language?.startsWith('es')) return 'es';
    return 'en';
  });

  const t = useCallback((key) => {
    const keys = key.split('.');
    let result = translations[lang];
    for (const k of keys) {
      result = result?.[k];
    }
    return result ?? key;
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'es' : 'en';
      localStorage.setItem('portfolio-lang', next);
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
