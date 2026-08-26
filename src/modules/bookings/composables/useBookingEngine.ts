import { ref, computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { Booking, BookingServiceConfig, DaySchedule } from '@/core/api/booking'
import { formatLocalDate } from '@/core/lib/utils'
import { timeToMinutes } from '../utils/booking.utils'

export function useBookingEngine(
  selectedServiceParam: MaybeRefOrGetter<BookingServiceConfig | undefined>,
  existingBookingsParam: MaybeRefOrGetter<Booking[]>,
) {
  const selectedService = computed(() => toValue(selectedServiceParam))
  const existingBookings = computed(() => toValue(existingBookingsParam) ?? [])

  const selectedStartDate = ref<string>('')
  const selectedEndDate = ref<string>('')
  const selectedTimeSlot = ref<string>('')
  const startTime = ref<string>('')
  const endTime = ref<string>('')

  // Helper para obtener el horario según el día de la semana
  function getDaySchedule(cfg: BookingServiceConfig, dayOfWeek: number): DaySchedule | undefined {
    return cfg.weeklySchedules?.find((s) => s.dayOfWeek === dayOfWeek)
  }

  // 1. Validar rango de días
  const isRangeValid = computed(() => {
    const cfg = selectedService.value
    if (!cfg || cfg.mode !== 'days_range' || !selectedStartDate.value || !selectedEndDate.value) {
      return true
    }

    const start = new Date(`${selectedStartDate.value}T00:00:00`)
    const end = new Date(`${selectedEndDate.value}T00:00:00`)

    if (start >= end) return false

    const current = new Date(start)
    while (current <= end) {
      const dateStr = formatLocalDate(current)
      const dayOfWeek = current.getDay()
      const daySchedule = getDaySchedule(cfg, dayOfWeek)

      // Validar si la fecha está deshabilitada o si el día de la semana no opera/abre
      if (cfg.disabledDates?.includes(dateStr) || !daySchedule || !daySchedule.isOpen) {
        return false
      }
      current.setDate(current.getDate() + 1)
    }

    const hasConflict = existingBookings.value.some((b) => {
      if (b.status === 'cancelled' || b.serviceId !== cfg.id) return false
      const bStart = b.date
      const bEnd = b.endDate ?? b.date
      return selectedStartDate.value <= bEnd && selectedEndDate.value >= bStart
    })

    return !hasConflict
  })

  // 2. Validar rango de horas continuo
  const isTimeRangeValid = computed(() => {
    const cfg = selectedService.value
    if (
      !cfg ||
      cfg.mode !== 'custom_time_range' ||
      !selectedStartDate.value ||
      !startTime.value ||
      !endTime.value
    ) {
      return true
    }

    if (startTime.value >= endTime.value) return false

    const dateStr = selectedStartDate.value
    const dayOfWeek = new Date(`${dateStr}T00:00:00`).getDay()
    const daySchedule = getDaySchedule(cfg, dayOfWeek)

    if (cfg.disabledDates?.includes(dateStr) || !daySchedule || !daySchedule.isOpen) {
      return false
    }

    const opHours = daySchedule.operationalHours
    if (!opHours || startTime.value < opHours.start || endTime.value > opHours.end) {
      return false
    }

    const startMins = timeToMinutes(startTime.value)
    const endMins = timeToMinutes(endTime.value)

    const hasConflict = existingBookings.value.some((b) => {
      if (b.date !== dateStr || b.status === 'cancelled' || b.serviceId !== cfg.id) return false
      if (!b.time) return false

      const bStartMins = timeToMinutes(b.time)
      const bEndMins = b.endTime
        ? timeToMinutes(b.endTime)
        : bStartMins + (cfg.slotDurationMinutes || 30)

      return startMins < bEndMins && endMins > bStartMins
    })

    return !hasConflict
  })

  // 3. Generar bloques dinámicos
  const availableTimeSlots = computed(() => {
    const cfg = selectedService.value
    if (!cfg || cfg.mode !== 'time_slots' || !selectedStartDate.value) {
      return []
    }

    const dateStr = selectedStartDate.value
    const dayOfWeek = new Date(`${dateStr}T00:00:00`).getDay()
    const daySchedule = getDaySchedule(cfg, dayOfWeek)

    if (cfg.disabledDates?.includes(dateStr) || !daySchedule || !daySchedule.isOpen) {
      return []
    }

    // Si el modo requiere clases fijas (ej. ['07:00', '08:00'])
    if (daySchedule.fixedSlots && daySchedule.fixedSlots.length > 0) {
      return daySchedule.fixedSlots
    }

    const opHours = daySchedule.operationalHours
    if (!opHours) return []

    const slots: string[] = []
    const interval = cfg.slotIntervalMinutes || 15
    const duration = cfg.slotDurationMinutes || interval
    const startMins = timeToMinutes(opHours.start)
    const endMins = timeToMinutes(opHours.end)

    const activeBookings = existingBookings.value.filter(
      (b) => b.date === dateStr && b.status !== 'cancelled' && b.serviceId === cfg.id && b.time,
    )

    let currentMins = startMins

    while (currentMins + duration <= endMins) {
      const slotEndMins = currentMins + duration

      const hasConflict = activeBookings.some((b) => {
        const bStartMins = timeToMinutes(b.time!)
        const bEndMins = b.endTime ? timeToMinutes(b.endTime) : bStartMins + duration

        return currentMins < bEndMins && slotEndMins > bStartMins
      })

      if (!hasConflict) {
        const h = Math.floor(currentMins / 60)
          .toString()
          .padStart(2, '0')
        const m = (currentMins % 60).toString().padStart(2, '0')
        slots.push(`${h}:${m}`)
      }

      currentMins += interval
    }

    return slots
  })

  function resetEngine() {
    selectedStartDate.value = ''
    selectedEndDate.value = ''
    selectedTimeSlot.value = ''
    startTime.value = ''
    endTime.value = ''
  }

  return {
    selectedStartDate,
    selectedEndDate,
    selectedTimeSlot,
    startTime,
    endTime,
    isRangeValid,
    isTimeRangeValid,
    availableTimeSlots,
    resetEngine,
  }
}
