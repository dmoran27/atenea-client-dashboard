import { computed, type Ref, type MaybeRefOrGetter, toValue } from 'vue'
import type { Booking } from '@/core/api/booking'
import { isBookingPast } from '../utils/booking.utils'

export interface UseBookingPermissionsOptions {
  allowPastReschedule?: MaybeRefOrGetter<boolean>
}

export function useBookingPermissions(
  booking: MaybeRefOrGetter<Booking | null | undefined>,
  options: UseBookingPermissionsOptions = {},
) {
  const isPast = computed(() => {
    const b = toValue(booking)
    return b ? isBookingPast(b) : false
  })

  const canReschedule = computed(() => {
    const b = toValue(booking)
    if (!b) return false

    if (b.status === 'cancelled' || b.status === 'completed') {
      return false
    }

    const allowPast = toValue(options.allowPastReschedule) ?? false
    if (isPast.value && !allowPast) {
      return false
    }

    return true
  })

  return {
    isPast,
    canReschedule,
  }
}
