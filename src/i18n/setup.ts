import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Pseudo from 'i18next-pseudo';
import resources from './locales';
import ICU from "i18next-icu";

export function setupI18n(): void {
  i18n
    .use(ICU)
    .use(initReactI18next)
    .use(new Pseudo({
      enabled: true,
      languageToPseudo: 'tlh',
      letterMultiplier: 1,
    }))
    .use(LanguageDetector)
    .init({
      detection: {
        order: ['querystring', 'localStorage', 'navigator'],
        caches: [],
      },
      resources,
      fallbackLng: 'en',
      postProcess: ['pseudo'],
      interpolation: {
        escapeValue: false, // not needed for react
      },
      keySeparator: false,
      nsSeparator: false,
    });
}
