import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/core/layouts/AuthLayout.vue'),
    meta: { guestOnly: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('./views/AuthView.vue'),
        meta: {
          titleKey: 'auth.login.welcome',
          requiresAuth: false,
          guestOnly: true,
        },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('./views/ForgotPasswordView.vue'),
        meta: {
          titleKey: 'auth.forgotPassword.title',
          requiresAuth: false,
          guestOnly: true,
        },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('./views/AuthView.vue'),
        meta: {
          titleKey: 'auth.signup.submit',
          requiresAuth: false,
          guestOnly: true,
        },
      },
    ],
  },
]
