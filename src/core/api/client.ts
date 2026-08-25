import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type AxiosInstance,
} from 'axios'
import { toast } from 'vue-sonner'
import i18n from '@/core/plugins/i18n'

const baseConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
}

// Helper seguro para obtener la función de traducción
function getTranslation(key: string): string {
  // Maneja tanto Composition API (global.t) como Legacy API
  const globalI18n = i18n.global as any
  return typeof globalI18n.t === 'function' ? globalI18n.t(key) : key
}

function attachInterceptors(instance: AxiosInstance): AxiosInstance {
  // 1. Interceptor de Petición
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const { useAuthStore } = await import('@/core/stores/useAuthStore')
      const authStore = useAuthStore()

      if (authStore.token && config.headers) {
        config.headers.Authorization = `Bearer ${authStore.token}`
      }

      return config
    },
    (error: AxiosError) => Promise.reject(error),
  )

  // 2. Interceptor de Respuesta
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const status = error.response?.status

      if (status === 401) {
        const { useAuthStore } = await import('@/core/stores/useAuthStore')
        const authStore = useAuthStore()

        // Solo limpiamos si el usuario aún tenía sesión activa para evitar alertas repetidas
        if (authStore.isAuthenticated) {
          authStore.clearSession()
          toast.error(getTranslation('errors.http.unauthorized'))
        }
      } else if (status === 403) {
        toast.error(getTranslation('errors.http.forbidden'))
      } else if (status === 500) {
        toast.error(getTranslation('errors.http.serverError'))
      } else if (!error.response) {
        toast.error(getTranslation('errors.http.networkError'))
      }

      return Promise.reject(error)
    },
  )

  return instance
}

// Cliente Backend Core (Laravel)
export const coreApi = attachInterceptors(
  axios.create({
    ...baseConfig,
    baseURL: import.meta.env.VITE_CORE_API_URL || '/api/core',
  }),
)

// Cliente Servicio de Reservas (NestJS)
export const bookingApi = attachInterceptors(
  axios.create({
    ...baseConfig,
    baseURL: import.meta.env.VITE_BOOKING_API_URL || '/api/booking',
  }),
)
