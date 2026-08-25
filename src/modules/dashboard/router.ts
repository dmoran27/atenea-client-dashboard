import { LayoutDashboard } from '@lucide/vue'
import type { RouteRecordRaw } from 'vue-router'

export const dashboardRoutes: RouteRecordRaw[] = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./views/DashbordView.vue'),
    meta: {
      titleKey: 'dashboard.nav',
      showInNav: true,
      moduleKey: 'dashboard',
      order: 1,
      soon: false,
      icon: LayoutDashboard,
    },
  },
]
