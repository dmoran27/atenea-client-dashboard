import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import router from '@/core/router'
import { authApi } from '@/core/api/auth'
import { useTenantStore } from '@/core/stores/useTenantStore'
import type { AuthUser } from '../api/auth/auth.interface'
import { t } from '../plugins/i18n'

export const useAuthStore = defineStore('auth', () => {
  const queryClient = useQueryClient()
  const tenantStore = useTenantStore()

  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(localStorage.getItem(tenantStore.tokenKey))

  const isAuthenticated = computed(() => Boolean(token.value))

  function setSession(newToken: string, newUser: AuthUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem(tenantStore.tokenKey, newToken)
  }

  function setUser(updatedUser: AuthUser | null) {
    user.value = updatedUser
  }

  function clearSession(showNotification = false) {
    user.value = null
    token.value = null
    localStorage.removeItem(tenantStore.tokenKey)
    queryClient.clear()
    router.push({ name: 'login' })

    if (showNotification) {
      toast.info(t('auth.notifications.sessionExpired'))
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await authApi.logout()
      }
      toast.success(t('auth.notifications.logoutSuccess'))
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      toast.error(t('auth.notifications.logoutError'))
    } finally {
      clearSession()
    }
  }

  async function fetchUser() {
    if (!token.value) return null

    try {
      const userData = await authApi.me()
      user.value = userData
      return userData
    } catch (error) {
      clearSession(true)
      return null
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    setSession,
    setUser,
    clearSession,
    logout,
    fetchUser,
  }
})
