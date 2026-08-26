import { CalendarDays } from '@lucide/vue'
import type { RouteRecordRaw } from 'vue-router'

export const bookingRoutes: RouteRecordRaw[] = [
  {
    path: 'bookings',
    name: 'bookings',
    component: () => import('./views/BookingView.vue'),
    meta: {
      titleKey: 'bookings.nav',
      showInNav: true,
      moduleKey: 'bookings',
      order: 2,
      soon: false,
      icon: CalendarDays,
    },
  },
]
