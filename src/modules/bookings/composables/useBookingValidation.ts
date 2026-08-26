import { computed, type Ref } from 'vue'
import { t } from '@/core/plugins/i18n'
import type { BookingServiceConfig } from '@/core/api/booking'
import { formatLocalDate } from '@/core/lib/utils'
import {
  timeToMinutes,
  isWithinOperationalHours,
  isTooSoon,
  getCurrentTimeStr,
} from '../utils/booking.utils'

interface ValidationParams {
  date: Ref<string>
  endDate: Ref<string>
  time: Ref<string>
  endTime: Ref<string>
  currentConfig: Ref<BookingServiceConfig | undefined>
  minAdvanceHours: Ref<number>
  todayStr: Ref<string>
  currentDaySchedule: Ref<{ operationalHours?: { start: string; end: string } } | undefined>
  isDateDisabled: (dateStr: string) => boolean
  isSlotDisabled: (slotStr: string) => boolean
}

export function useBookingValidation(params: ValidationParams) {
  const singleDayError = computed(() => {
    if (params.currentConfig.value?.mode !== 'single_day' || !params.date.value) return ''
    if (params.date.value < params.todayStr.value) return t('bookingModal.errors.pastDate')
    if (isTooSoon(params.date.value, '00:00', params.minAdvanceHours.value)) {
      return t('bookingModal.errors.minAdvanceNotice')
    }
    return params.isDateDisabled(params.date.value) ? t('bookingModal.errors.dateDisabled') : ''
  })

  const daysRangeError = computed(() => {
    if (
      params.currentConfig.value?.mode !== 'days_range' ||
      !params.date.value ||
      !params.endDate.value
    )
      return ''

    if (params.date.value < params.todayStr.value) return t('bookingModal.errors.pastDate')
    if (params.date.value >= params.endDate.value) return t('bookingModal.errors.invalidRange')

    const checkInTime = params.currentDaySchedule.value?.operationalHours?.start || '14:00'
    if (isTooSoon(params.date.value, checkInTime, params.minAdvanceHours.value)) {
      return t('bookingModal.errors.minAdvanceNotice')
    }

    const start = new Date(`${params.date.value}T00:00:00`)
    const end = new Date(`${params.endDate.value}T00:00:00`)
    const current = new Date(start)

    while (current <= end) {
      if (params.isDateDisabled(formatLocalDate(current)))
        return t('bookingModal.errors.rangeHasDisabled')
      current.setDate(current.getDate() + 1)
    }

    return ''
  })

  const timeSlotsError = computed(() => {
    const mode = params.currentConfig.value?.mode
    if ((mode !== 'time_slots' && mode !== 'fixed_classes') || !params.date.value) return ''
    if (params.date.value < params.todayStr.value) return t('bookingModal.errors.pastDate')
    if (params.isDateDisabled(params.date.value)) return t('bookingModal.errors.dateDisabled')
    if (params.time.value && params.isSlotDisabled(params.time.value)) {
      return t('bookingModal.errors.slotUnavailable')
    }
    return ''
  })

  const customRangeError = computed(() => {
    if (params.currentConfig.value?.mode !== 'custom_time_range' || !params.date.value) return ''
    if (params.date.value < params.todayStr.value) return t('bookingModal.errors.pastDate')
    if (params.isDateDisabled(params.date.value)) return t('bookingModal.errors.dateDisabled')
    if (!params.time.value || !params.endTime.value) return ''

    // 1. Validar si la hora ya pasó en el día de hoy
    if (params.date.value === params.todayStr.value && params.time.value <= getCurrentTimeStr()) {
      return t('bookingModal.errors.pastTime')
    }

    // 2. Validar anticipación mínima requerida
    if (isTooSoon(params.date.value, params.time.value, params.minAdvanceHours.value)) {
      return t('bookingModal.errors.minAdvanceNotice')
    }

    // 3. Validar que fin sea mayor a inicio
    const startMins = timeToMinutes(params.time.value)
    const endMins = timeToMinutes(params.endTime.value)

    if (endMins <= startMins) {
      return t('bookingModal.errors.endBeforeStart')
    }

    // 4. Validar rango completo dentro del horario operacional con la utilidad importada
    const opHours = params.currentDaySchedule.value?.operationalHours
    if (opHours) {
      const isStartValid = isWithinOperationalHours(params.time.value, {
        start: opHours.start,
        end: opHours.end,
      })
      const isEndValid = isWithinOperationalHours(params.endTime.value, {
        start: opHours.start,
        end: opHours.end,
      })

      if (!isStartValid || !isEndValid) {
        return t('bookingModal.errors.outsideHours')
      }
    }

    return ''
  })

  const dateTimeValid = computed(() => {
    if (!params.currentConfig.value || !params.date.value) return false
    const mode = params.currentConfig.value.mode
    if (mode === 'single_day') return !singleDayError.value
    if (mode === 'days_range') return Boolean(params.endDate.value) && !daysRangeError.value
    if (mode === 'time_slots' || mode === 'fixed_classes') {
      return Boolean(params.time.value) && !timeSlotsError.value
    }
    if (mode === 'custom_time_range') {
      return Boolean(params.time.value) && Boolean(params.endTime.value) && !customRangeError.value
    }
    return false
  })

  return {
    singleDayError,
    daysRangeError,
    timeSlotsError,
    customRangeError,
    dateTimeValid,
  }
}
