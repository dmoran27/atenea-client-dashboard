import { Ticket } from '@lucide/vue'
import type { RouteRecordRaw } from 'vue-router'

export const couponRoutes: RouteRecordRaw[] = [
  {
    path: 'coupons',
    name: 'coupons',
    component: () => import('./views/CouponsView.vue'),
    meta: {
      titleKey: 'coupons.view.title',
      showInNav: true,
      moduleKey: 'coupons',
      order: 3,
      soon: false,
      icon: Ticket,
    },
  },
]
