import type { RouteLocationNormalized } from 'vue-router'
import { useTenantStore } from '@/core/stores/useTenantStore'
import { useAuthStore } from '@/core/stores/useAuthStore'

export function authGuard(to: RouteLocationNormalized) {
  const auth = useAuthStore()
  const isAuthenticated = Boolean(auth?.token)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }
}

export function guestGuard(to: RouteLocationNormalized) {
  const auth = useAuthStore()
  const isAuthenticated = Boolean(auth?.token)
  const isGuestOnly = to.matched.some((record) => record.meta.guestOnly)

  if (isGuestOnly && isAuthenticated) {
    return { name: 'dashboard' }
  }
}

export function tenantModuleGuard(to: RouteLocationNormalized) {
  const tenantStore = useTenantStore()
  const moduleKey = to.meta.moduleKey as string | undefined

  if (moduleKey && !tenantStore.hasModule(moduleKey)) {
    return { name: 'dashboard' }
  }
}
