import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/AuthView.vue'),
    meta: {
      guestOnly: true,
      layout: 'AuthLayout',
      titleKey: 'auth.login.welcome',
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('./views/ForgotPasswordView.vue'),
    meta: {
      guestOnly: true,
      layout: 'AuthLayout',
      titleKey: 'auth.forgotPassword.title',
    },
  },
]
