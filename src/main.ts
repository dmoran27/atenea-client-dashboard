// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from '@/core/router'
import i18n from '@/core/plugins/i18n'
import { VueQueryPlugin, queryClient } from '@/core/plugins/vue-query'
import { useTenantStore } from '@/core/stores/useTenantStore'
import { useAuthStore } from '@/core/stores/useAuthStore'
import '@/assets/styles/main.css'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()

  // 1. Core Plugins
  app.use(pinia)
  app.use(VueQueryPlugin, { queryClient, enableDevtoolsV6Plugin: true })
  app.use(i18n)

  // 2. Carga de datos críticos previos al montaje
  const tenantStore = useTenantStore()
  const authStore = useAuthStore()

  try {
    await Promise.all([
      tenantStore.fetchTenantConfig().catch((err) => console.error('Error tenant:', err)),
      authStore.fetchUser().catch((err) => console.error('Error user:', err)),
    ])
  } catch (error) {
    console.error('Error crítico en el bootstrap de la app:', error)
  }

  // 3. Router y Montaje
  app.use(router)
  app.mount('#app')
}

await bootstrap()
