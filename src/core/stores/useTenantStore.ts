import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface TenantInfo {
  id: string
  name: string
  logoUrl?: string
  modules: string[]
}

export const useTenantStore = defineStore('tenant', () => {
  const info = ref<TenantInfo | null>(null)
  const isLoading = ref(false)
  const isLoaded = ref(false)

  // Getters computados
  const siteName = computed(() => info.value?.name || 'Atenea')
  const enabledModules = computed(() => info.value?.modules || [])

  function hasModule(moduleKey: string): boolean {
    return enabledModules.value.includes(moduleKey)
  }

  async function fetchTenantConfig() {
    if (isLoaded.value) return

    isLoading.value = true
    try {
      // const domain = window.location.hostname
      // const { data } = await api.get<TenantInfo>(`/public/tenant-config?domain=${domain}`)

      // Simulación de respuesta API
      info.value = {
        id: 'tenant-123',
        name: 'Barbería Capital',
        modules: ['dashboard', 'bookings', 'coupons'],
      }
    } catch (error) {
      console.error('Error al cargar configuración del tenant:', error)
      info.value = null
    } finally {
      isLoading.value = false
      isLoaded.value = true
    }
  }

  return {
    info,
    siteName,
    enabledModules,
    isLoading,
    isLoaded,
    hasModule,
    fetchTenantConfig,
  }
})
