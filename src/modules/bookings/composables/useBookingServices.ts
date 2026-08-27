import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { bookingApi, type BookingServiceConfig, type DaySchedule } from '@/modules/bookings/api'
import { formatLocalDate } from '@/core/lib/utils'

export const bookingServiceKeys = {
  all: ['booking-services'] as const,
  lists: () => [...bookingServiceKeys.all, 'list'] as const,
  details: () => [...bookingServiceKeys.all, 'detail'] as const,
  detail: (id: MaybeRefOrGetter<string>) =>
    [...bookingServiceKeys.details(), () => toValue(id)] as const,
}

export function useBookingServices() {
  const servicesQuery = useQuery({
    queryKey: bookingServiceKeys.lists(),
    queryFn: () => bookingApi.getBookingServiceConfigs(),
    staleTime: 1000 * 60 * 30,
  })

  const services = computed<BookingServiceConfig[]>(() => servicesQuery.data.value ?? [])

  const servicesMap = computed(() => {
    const map = new Map<string, BookingServiceConfig>()
    services.value.forEach((service) => map.set(service.id, service))
    return map
  })

  const getServiceTitle = (serviceId: string, fallback = 'Servicio no encontrado'): string => {
    return servicesMap.value.get(serviceId)?.title ?? fallback
  }

  const getServiceConfig = (serviceId: string): BookingServiceConfig | undefined => {
    return servicesMap.value.get(serviceId)
  }

  const isDayAvailable = (serviceId: string, date: Date): boolean => {
    const config = getServiceConfig(serviceId)
    if (!config) return false

    // Formateo garantizado sin desfase UTC
    const dateStr = formatLocalDate(date)

    if (config.disabledDates?.includes(dateStr)) return false

    const dayOfWeek = date.getDay()
    const daySchedule = config.weeklySchedules?.find((s) => s.dayOfWeek === dayOfWeek)

    return daySchedule?.isOpen ?? false
  }

  const getDaySchedule = (serviceId: string, dayOfWeek: number): DaySchedule | undefined => {
    const config = getServiceConfig(serviceId)
    return config?.weeklySchedules?.find((s) => s.dayOfWeek === dayOfWeek)
  }

  const getFixedSlotsForDay = (serviceId: string, dayOfWeek: number): string[] => {
    const schedule = getDaySchedule(serviceId, dayOfWeek)
    if (!schedule || !schedule.isOpen || schedule.fixedSlots === undefined) return []
    return schedule.fixedSlots
  }

  const isGroupService = (serviceId: string): boolean => {
    const config = getServiceConfig(serviceId)
    return config?.capacityType === 'group'
  }

  return {
    services,
    servicesMap,
    isLoading: servicesQuery.isLoading,
    isFetching: servicesQuery.isFetching,
    error: servicesQuery.error,
    refetch: servicesQuery.refetch,
    getServiceTitle,
    getServiceConfig,
    isDayAvailable,
    getDaySchedule,
    getFixedSlotsForDay,
    isGroupService,
  }
}
