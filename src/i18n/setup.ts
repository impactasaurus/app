import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Pseudo from 'i18next-pseudo';
import resources from './locales';

export function setupI18n() {
  console.log(resources);
  i18n
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
    });
}
