import { ref, watch } from 'vue'
import type { ThemeMode } from '@/core/types/global'

const STORAGE_KEY = 'atenea-theme'
const theme = ref<ThemeMode>('light')
let initialized = false

function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', mode === 'dark')
}

function initTheme() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null

  if (stored === 'dark' || stored === 'light') {
    theme.value = stored
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.value = 'dark'
  }

  applyTheme(theme.value)

  // Escuchar cambios del SO solo si el usuario no ha forzado una preferencia manual
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      theme.value = e.matches ? 'dark' : 'light'
    }
  })
}

// Inicialización segura
initTheme()

watch(theme, (newTheme) => {
  applyTheme(newTheme)
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, newTheme)
  }
})

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function setTheme(mode: ThemeMode) {
    theme.value = mode
  }

  return {
    theme,
    toggleTheme,
    setTheme,
  }
}
