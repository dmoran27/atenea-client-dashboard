import { type WritableComputedRef } from 'vue'
import { createI18n } from 'vue-i18n'
import coreEs from '../locales/es.json'
import coreEn from '../locales/en.json'

export type AppLocale = 'es' | 'en'

const STORAGE_KEY = 'atenea-locale'

const messages: Record<AppLocale, Record<string, any>> = {
  es: { ...coreEs },
  en: { ...coreEn },
}

const moduleLocales = import.meta.glob<{ default: Record<string, any> }>(
  '/src/modules/**/locales/*.json',
  { eager: true },
)

for (const path in moduleLocales) {
  const fileName = path.split('/').pop()?.replace('.json', '') as AppLocale | undefined
  const moduleData = moduleLocales[path]?.default

  if (fileName && messages[fileName] && moduleData) {
    Object.assign(messages[fileName], moduleData)
  }
}

function getInitialLocale(): AppLocale {
  const stored = localStorage.getItem(STORAGE_KEY) as AppLocale | null
  if (stored === 'es' || stored === 'en') return stored
  return 'es'
}

// Aplicamos `as const` para asegurar literales exactos (ej: style: 'currency' en vez de string)
const numberFormats = {
  es: {
    currency: {
      style: 'currency',
      currency: 'VES',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
    },
    currencyEUR: { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 },
    currencyUSD: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
  },
  en: {
    currency: {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
    },
    currencyVES: { style: 'currency', currency: 'VES', minimumFractionDigits: 2 },
    currencyEUR: { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 },
  },
} as const

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'es',
  messages,
  numberFormats,
})

export function setLocale(locale: AppLocale) {
  const globalLocale = i18n.global.locale as unknown as WritableComputedRef<AppLocale>
  globalLocale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.lang = locale
}

export function getLocale(): AppLocale {
  const globalLocale = i18n.global.locale as unknown as WritableComputedRef<AppLocale>
  return globalLocale.value
}

export function t(key: string, pluralization?: number, options?: Record<string, unknown>): string {
  if (pluralization !== undefined) {
    return i18n.global.t(key, pluralization, options ?? {})
  }
  return i18n.global.t(key, options ?? {})
}

export default i18n
