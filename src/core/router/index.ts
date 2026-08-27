import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { authRoutes } from '@/modules/auth/router'
import AdminLayout from '../layouts/AdminLayout.vue'
import { useTenantStore } from '@/core/stores/useTenantStore'
import { APP_CONFIG } from '@/core/config/app.config'
import { authGuard, guestGuard, tenantModuleGuard } from './guards'

// Definición base de la estructura de rutas
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/admin' },
  {
    path: '/admin',
    name: 'admin',
    component: AdminLayout,
    redirect: { name: 'dashboard' },
    meta: {
      requiresAuth: true,
      guestOnly: false,
    },
    children: [], // Se poblará dinámicamente con registerModuleRoutes()
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

// Auto-descubrimiento dinámico de rutas
const moduleRouteFiles = import.meta.glob<{
  [key: string]: RouteRecordRaw[] | RouteRecordRaw
}>('/src/modules/**/router.ts', { eager: true })

export function registerModuleRoutes() {
  for (const path in moduleRouteFiles) {
    // Ignorar las rutas de Auth
    if (path.includes('/modules/auth/')) continue

    const moduleExports = moduleRouteFiles[path]
    if (!moduleExports) continue

    Object.values(moduleExports).forEach((routeExport) => {
      if (Array.isArray(routeExport)) {
        routeExport.forEach((route) => router.addRoute('admin', route))
      } else if (routeExport && typeof routeExport === 'object' && 'path' in routeExport) {
        router.addRoute('admin', routeExport)
      }
    })
  }
}

// Ejecución del autoregistro antes de los guards
registerModuleRoutes()

router.beforeEach((to) => {
  return authGuard(to) || guestGuard(to) || tenantModuleGuard(to) || true
})

router.afterEach((to) => {
  const tenantStore = useTenantStore()
  const pageTitleKey = to.meta?.titleKey as string | undefined
  const siteName = tenantStore.siteName || APP_CONFIG.name
  document.title = pageTitleKey ? `${pageTitleKey} | ${siteName}` : siteName
})

export default router
