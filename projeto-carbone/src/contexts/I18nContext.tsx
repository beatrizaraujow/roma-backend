import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import ptBR from '../i18n/pt-BR.json';
import enUS from '../i18n/en-US.json';
import esES from '../i18n/es-ES.json';

type Locale = 'pt-BR' | 'en-US' | 'es-ES';

const translations = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-ES': esES,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Verificar preferência salva
    const saved = localStorage.getItem('locale') as Locale | null;
    if (saved && Object.keys(translations).includes(saved)) {
      return saved;
    }

    // Detectar idioma do navegador
    const browserLang = navigator.language;
    if (browserLang.startsWith('pt')) return 'pt-BR';
    if (browserLang.startsWith('es')) return 'es-ES';
    return 'en-US';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale.split('-')[0];
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }

    // Substituir parâmetros
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, param) => params[param] || '');
    }

    return value;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n deve ser usado dentro de I18nProvider');
  }
  return context;
};
