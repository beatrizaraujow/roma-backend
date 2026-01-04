import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import './LanguageSelector.css';

export const LanguageSelector: React.FC = () => {
  const { locale, setLocale } = useI18n();

  const languages = [
    { code: 'pt-BR' as const, label: 'Português', flag: '🇧🇷' },
    { code: 'en-US' as const, label: 'English', flag: '🇺🇸' },
    { code: 'es-ES' as const, label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <div className="language-selector">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as any)}
        className="language-select"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};
