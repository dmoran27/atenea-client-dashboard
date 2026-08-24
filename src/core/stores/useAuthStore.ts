import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/core/router'
import { authApi, type AuthUser, type LoginCredentials } from '@/core/api/authApi'

const TOKEN_KEY = 'atenea_auth_token'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const isLoading = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value))

  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    try {
      const response = await authApi.login(credentials)

      token.value = response.token
      user.value = response.user
      localStorage.setItem(TOKEN_KEY, response.token)

      await router.push({ name: 'dashboard' })
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProfile() {
    if (!token.value) return

    isLoading.value = true
    try {
      user.value = await authApi.me()
    } catch {
      logout()
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await authApi.logout()
      }
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem(TOKEN_KEY)
      router.push({ name: 'login' })
    }
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    fetchProfile,
    logout,
  }
})
