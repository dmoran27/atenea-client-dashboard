import { Package } from '@lucide/vue'
import type { RouteRecordRaw } from 'vue-router'

export const orderRoutes: RouteRecordRaw[] = [
  {
    path: 'orders',
    name: 'orders',
    component: () => import('./views/OrderView.vue'),
    meta: {
      titleKey: 'orders.view.title',
      showInNav: true,
      moduleKey: 'orders',
      order: 4,
      soon: false,
      icon: Package,
    },
  },
]
