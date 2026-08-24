import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from '@/core/router'
import i18n from '@/core/plugins/i18n'
import '@/assets/styles/main.css'
import { useTenantStore } from './core/stores/useTenantStore.ts'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Cargar configuración del Tenant por dominio antes de iniciar el Router
const tenantStore = useTenantStore()
await tenantStore.fetchTenantConfig()

app.use(router)
app.use(i18n)

// Montaje de la aplicación
app.mount('#app')
