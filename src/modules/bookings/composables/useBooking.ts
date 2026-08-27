import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { bookingApi } from '@/modules/bookings/api'
import {
  getCreateBookingSchema,
  getUpdateBookingSchema,
  getCancelBookingSchema,
  type CreateBookingSchema,
  type UpdateBookingSchema,
  type CancelBookingSchema,
} from '../schemas/booking.schema'
import type { BookingFilters, CancelBookingPayload } from '@/modules/bookings/api'

export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (filters: MaybeRefOrGetter<BookingFilters>) =>
    [...bookingKeys.lists(), () => toValue(filters)] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: MaybeRefOrGetter<string>) => [...bookingKeys.details(), () => toValue(id)] as const,
  metrics: () => [...bookingKeys.all, 'metrics'] as const,
}

export function useBookings(filters?: MaybeRefOrGetter<BookingFilters>) {
  const queryClient = useQueryClient()

  const schemas = computed(() => ({
    create: getCreateBookingSchema(),
    update: getUpdateBookingSchema(),
    cancel: getCancelBookingSchema(),
  }))

  const bookingsQuery = useQuery({
    queryKey: bookingKeys.list(filters ?? {}),
    queryFn: () => bookingApi.getBookings(filters ? toValue(filters) : undefined),
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreateBookingSchema) => {
      const validatedPayload = schemas.value.create.parse(payload)
      return bookingApi.createBooking(validatedPayload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBookingSchema }) => {
      const validatedPayload = schemas.value.update.parse(payload)
      return bookingApi.updateBooking(id, validatedPayload)
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all })
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) })
    },
  })

  const cancelMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: CancelBookingSchema }) => {
      const validatedPayload = payload ? schemas.value.cancel.parse(payload) : undefined
      return bookingApi.cancelBooking(id, validatedPayload as CancelBookingPayload)
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all })
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) })
    },
  })

  return {
    bookings: computed(() => bookingsQuery.data.value ?? []),
    isLoadingBookings: bookingsQuery.isLoading,
    isFetchingBookings: bookingsQuery.isFetching,
    bookingsError: bookingsQuery.error,
    refetchBookings: bookingsQuery.refetch,

    createBooking: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateBooking: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    cancelBooking: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,

    schemas,
  }
}

export function useBookingDetail(id: MaybeRefOrGetter<string>) {
  const bookingId = computed(() => toValue(id))

  const detailQuery = useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingApi.getBookingById(bookingId.value),
    enabled: computed(() => Boolean(bookingId.value)),
  })

  return {
    booking: computed(() => detailQuery.data.value),
    isLoading: detailQuery.isLoading,
    error: detailQuery.error,
    refetch: detailQuery.refetch,
  }
}

// 2. Composable para obtener las métricas del dashboard
export function useBookingMetrics() {
  const metricsQuery = useQuery({
    queryKey: bookingKeys.metrics(),
    queryFn: () => bookingApi.getBookingDashboardMetrics(),
  })

  return {
    metrics: computed(() => metricsQuery.data.value),
    isLoadingMetrics: metricsQuery.isLoading,
    metricsError: metricsQuery.error,
    refetchMetrics: metricsQuery.refetch,
  }
}
