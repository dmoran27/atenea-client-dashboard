import { createI18n } from 'vue-i18n'

import coreEs from '../locales/es.json'
import coreEn from '../locales/en.json'

export type AppLocale = 'es' | 'en'

const STORAGE_KEY = 'atenea-locale'
const messages: Record<string, unknown> = {
  es: { ...coreEs },
  en: { ...coreEn },
}

// Carga automática de los locales de cada módulo
const moduleLocales = import.meta.glob<{ default: Record<string, unknown> }>(
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

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'es',
  messages,
})

export function setLocale(locale: AppLocale) {
  // Casteo explícito a Ref para asegurar reactividad en TypeScript
  ;(i18n.global.locale as unknown as { value: AppLocale }).value = locale
  localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.lang = locale
}

export function getLocale(): AppLocale {
  return (i18n.global.locale as unknown as { value: AppLocale }).value
}

export function t(key: string, pluralization?: number, options?: any): string {
  const globalI18n = i18n.global as any
  if (typeof globalI18n.t === 'function') {
    return globalI18n.t(key, pluralization, options)
  }
  return key
}

export default i18n
