import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { setLocale, type AppLocale } from '@/core/plugins/i18n'
import type { ThemeMode } from '@/core/types/global'

const THEME_STORAGE_KEY = 'atenea-theme'
const LANG_STORAGE_KEY = 'atenea-language'

const SUPPORTED_LOCALES: readonly AppLocale[] = ['es', 'en'] as const
const DEFAULT_LOCALE: AppLocale = 'es'

export const usePreferencesStore = defineStore('preferences', () => {
  // --- ESTADO ---
  const theme = ref<ThemeMode>('light')
  const currentLocale = ref<AppLocale>(DEFAULT_LOCALE)
  let initialized = false

  // --- HELPERS / VALIDACIONES ---
  function isValidLocale(locale: string | null): locale is AppLocale {
    return typeof locale === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(locale)
  }

  function detectBrowserLanguage(): AppLocale {
    if (typeof navigator === 'undefined') return DEFAULT_LOCALE
    const langParts = navigator.language.split('-')
    const browserLang = langParts[0]?.toLowerCase() ?? ''

    return isValidLocale(browserLang) ? browserLang : DEFAULT_LOCALE
  }

  function applyTheme(mode: ThemeMode) {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
  }

  function applyLocale(locale: AppLocale) {
    setLocale(locale)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }

  // --- ACCIONES ---
  function setTheme(mode: ThemeMode) {
    theme.value = mode
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function setLanguage(locale: AppLocale) {
    if (isValidLocale(locale)) {
      currentLocale.value = locale
    }
  }

  function toggleLanguage() {
    const currentIndex = SUPPORTED_LOCALES.indexOf(currentLocale.value)
    const nextIndex = (currentIndex + 1) % SUPPORTED_LOCALES.length
    const nextLocale = SUPPORTED_LOCALES[nextIndex]

    if (nextLocale) {
      currentLocale.value = nextLocale
    }
  }

  // --- INICIALIZACIÓN ---
  function initPreferences() {
    if (initialized || typeof window === 'undefined') return
    initialized = true

    // 1. Inicializar Tema
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
    if (storedTheme === 'dark' || storedTheme === 'light') {
      theme.value = storedTheme
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
    }

    applyTheme(theme.value)

    // Listener para cambios del S.O. (solo si no hay preferencia manual guardada)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        theme.value = e.matches ? 'dark' : 'light'
      }
    })

    // 2. Inicializar Idioma
    const storedLang = localStorage.getItem(LANG_STORAGE_KEY)
    if (isValidLocale(storedLang)) {
      currentLocale.value = storedLang
    } else {
      currentLocale.value = detectBrowserLanguage()
    }

    applyLocale(currentLocale.value)
  }

  // Ejecució de inicialización
  initPreferences()

  // --- WATCHERS ---
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    }
  })

  watch(currentLocale, (newLocale) => {
    applyLocale(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_STORAGE_KEY, newLocale)
    }
  })

  return {
    // Estado
    theme,
    currentLocale,
    supportedLocales: SUPPORTED_LOCALES,

    // Acciones
    setTheme,
    toggleTheme,
    setLanguage,
    toggleLanguage,
    initPreferences,
  }
})
