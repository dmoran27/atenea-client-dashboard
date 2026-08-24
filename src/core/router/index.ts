import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { authRoutes } from '@/modules/auth/router'
import AdminLayout from '../layouts/AdminLayout.vue'
import { useTenantStore } from '@/core/stores/useTenantStore'
import { APP_CONFIG } from '@/core/config/app.config'

const AUTH_KEY = 'atenea-user'

// Colección centralizada de rutas de módulos administrativos
const adminModuleRoutes: RouteRecordRaw[] = [
  // ...dashboardRoutes,
  // ...bookingRoutes,
  // ...couponRoutes,
]

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/admin' },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: { name: 'dashboard' },
    /*meta: { requiresAuth: true },*/ // Aplica protección a todas las rutas hijas automáticamente
    children: adminModuleRoutes,
  },
  ...authRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/admin',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Single Guard unificado con retornos modernos de Vue Router 4
router.beforeEach((to) => {
  const tenantStore = useTenantStore()
  const isAuthenticated = Boolean(localStorage.getItem(AUTH_KEY))

  // 1. Verificación de Autenticación (evalúa padres e hijos)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  if (requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }

  // 2. Redirección de usuarios autenticados tratando de entrar a vistas públicas (ej. Login)
  if (to.meta.guestOnly && isAuthenticated) {
    return { name: 'dashboard' }
  }

  // 3. Verificación de Módulos SaaS habilitados por el Dominio
  const moduleKey = to.meta.moduleKey as string | undefined
  if (moduleKey && !tenantStore.hasModule(moduleKey)) {
    return { name: 'dashboard' }
  }

  return true
})

router.afterEach((to) => {
  const tenantStore = useTenantStore()
  const pageTitleKey = to.meta.titleKey
  const siteName = tenantStore.siteName || APP_CONFIG.name
  document.title = pageTitleKey ? `${pageTitleKey} | ${siteName}` : siteName
})

export { AUTH_KEY }
export default router
