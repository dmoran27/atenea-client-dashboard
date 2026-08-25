import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

// 1. Instancia centralizada del QueryClient con configuraciones óptimas para un SaaS/CMS
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran "frescos" antes de requerir un refetch automático al enfocar la pestaña (5 minutos)
      staleTime: 1000 * 60 * 5,

      // Tiempo que la caché inactiva se guarda en memoria antes de ser eliminada (10 minutos)
      gcTime: 1000 * 60 * 10,

      // Número de reintentos automáticos si una petición falla por red
      retry: 1,

      // Evita refetches molestos al cambiar de pestaña en el navegador si los datos ya están en caché
      refetchOnWindowFocus: false,
    },
  },
})

export { VueQueryPlugin }
