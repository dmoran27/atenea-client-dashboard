import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { queryOptions, useQueryClient } from '@tanstack/vue-query'
import { tenantApi, type TenantInfo } from '@/core/api/tenant'

export const useTenantStore = defineStore('tenant', () => {
  const queryClient = useQueryClient()

  const info = ref<TenantInfo | null>(null)
  const isLoading = ref(false)
  const isLoaded = ref(false)

  const siteName = computed(() => info.value?.name || 'Atenea')
  const enabledModules = computed(() => info.value?.modules || [])

  const tokenKey = computed(() => {
    const identifier = info.value?.slug || info.value?.id
    return identifier ? `atenea_${identifier}_auth_token` : 'atenea_auth_token'
  })

  function hasModule(moduleKey: string): boolean {
    return enabledModules.value.includes(moduleKey)
  }

  async function fetchTenantConfig() {
    if (isLoaded.value) return

    isLoading.value = true
    try {
      const domain = window.location.hostname

      info.value = await queryClient.query(
        queryOptions({
          queryKey: ['tenant-config', domain] as const,
          queryFn: () => tenantApi.getTenantConfig(domain),
          staleTime: Infinity,
        }),
      )
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
    tokenKey,
    isLoading,
    isLoaded,
    hasModule,
    fetchTenantConfig,
  }
})
