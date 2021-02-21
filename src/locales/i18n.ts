import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export function setupI18n() {
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      detection: {
        order: ['querystring', 'localStorage', 'navigator'],
        caches: [],
      },
      resources: {
        en: {
          translation: require('./en.json'),
        },
        cy: {
          translation: require('./cy.json'),
        },
        pt: {
          translation: require('./pt.json'),
        },
      },
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
}
