import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from '@/locales/en/translation.json';
import arTranslations from '@/locales/ar/translation.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  ar: {
    translation: arTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Enforce English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safe from xss
    },
  });

i18n.on('languageChanged', () => {
  // Enforce English (LTR) globally
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = 'en';
});

export default i18n;
