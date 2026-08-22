import { createI18n } from 'vue-i18n';
import es from '@/locales/es.json';
import en from '@/locales/en.json';

export const i18n = createI18n(
    {
        legacy: false, // Habilita el modo Composition API
        locale: 'es',   // Idioma por defecto
        fallbackLocale: 'es',
        messages: {
            es,
        },
    },
    {
        legacy: false, // Habilita el modo Composition API
        locale: 'en',   // Idioma por defecto
        fallbackLocale: 'en',
        messages: {
            en,
        },
    }
);