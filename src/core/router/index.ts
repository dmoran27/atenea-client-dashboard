import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { authRoutes } from '@/modules/auth/router'
import AdminLayout from '../layouts/AdminLayout.vue'
import { useTenantStore } from '@/core/stores/useTenantStore'
import { APP_CONFIG } from '@/core/config/app.config'
import { dashboardRoutes } from '@/modules/dashboard/router.ts'
import { authGuard, guestGuard, tenantModuleGuard } from './guards.ts'

// Colección centralizada de rutas de módulos administrativos
const adminModuleRoutes: RouteRecordRaw[] = [
  ...dashboardRoutes,
  // ...bookingRoutes,
  // ...couponRoutes,
]

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/admin' },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: { name: 'dashboard' },
    meta: {
      requiresAuth: true,
      guestOnly: false,
    },
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

router.beforeEach((to) => {
  return authGuard(to) || guestGuard(to) || tenantModuleGuard(to) || true
})

router.afterEach((to) => {
  const tenantStore = useTenantStore()
  const pageTitleKey = to.meta.titleKey
  const siteName = tenantStore.siteName || APP_CONFIG.name
  document.title = pageTitleKey ? `${pageTitleKey} | ${siteName}` : siteName
})

export default router
