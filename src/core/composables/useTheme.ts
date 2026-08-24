import { ref, watch } from 'vue'
import type { ThemeMode } from '@/core/types'

const STORAGE_KEY = 'atenea-theme'
const theme = ref<ThemeMode>('light')

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  if (mode === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// Initialize from storage
const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
if (stored === 'dark' || stored === 'light') {
  theme.value = stored
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  theme.value = 'dark'
}
applyTheme(theme.value)

watch(theme, (newTheme) => {
  applyTheme(newTheme)
  localStorage.setItem(STORAGE_KEY, newTheme)
})

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  function setTheme(mode: ThemeMode) {
    theme.value = mode
  }
  return { theme, toggleTheme, setTheme }
}
