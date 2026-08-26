import { LifeBuoy } from '@lucide/vue'
import type { RouteRecordRaw } from 'vue-router'

export const supportRoutes: RouteRecordRaw[] = [
  {
    path: '/support',
    name: 'support',
    component: () => import('./views/SupportView.vue'),
    meta: {
      titleKey: 'support.view.title',
      showInNav: true,
      moduleKey: 'support',
      order: 5,
      soon: false,
      icon: LifeBuoy,
    },
  },
]
