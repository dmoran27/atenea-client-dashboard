import 'vue-router'
import type { Component } from 'vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    titleKey?: string
    showInNav?: boolean
    moduleKey?: string
    order?: number
    soon?: boolean
    icon?: Component
  }
}
