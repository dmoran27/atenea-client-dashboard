import { User } from '@lucide/vue'
import type { RouteRecordRaw } from 'vue-router'

export const profileRoutes: RouteRecordRaw[] = [
  {
    path: 'profile',
    name: 'profile',
    component: () => import('./views/ProfileView.vue'),
    meta: {
      titleKey: 'profile.view.title',
      showInNav: true,
      moduleKey: 'profile',
      order: 5,
      soon: false,
      icon: User,
    },
  },
]
