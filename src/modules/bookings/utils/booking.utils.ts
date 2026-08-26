import type { Booking, BookingServiceConfig, DaySchedule } from '@/core/api/booking'

/**
 * Convierte una cadena de texto en formato de hora "HH:mm" a minutos totales transcurridos en el día.
 * @example timeToMinutes("02:30") => 150
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0
  const [h = 0, m = 0] = timeStr.split(':').map(Number)
  return h * 60 + m
}

/**
 * Obtiene la hora actual del sistema local formateada como "HH:mm".
 */
export function getCurrentTimeStr(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

/**
 * Genera una lista de intervalos de tiempo ("HH:mm") dentro del horario operativo según la configuración.
 *
 * @param config Configuración del servicio de reserva.
 * @param customOperationalHours Horario operativo específico (opcional, sobrescribe el de la config).
 */
export function generateTimeSlots(
  config?: BookingServiceConfig,
  operationalHours?: { start: string; end: string },
): string[] {
  if (!config || (config.mode !== 'time_slots' && config.mode !== 'fixed_classes')) return []
  if (!operationalHours?.start || !operationalHours?.end) return []

  const slots: string[] = []
  const interval = config.slotIntervalMinutes || 30

  let currentMinutes = timeToMinutes(operationalHours.start)
  const endMinutes = timeToMinutes(operationalHours.end)

  while (currentMinutes < endMinutes) {
    const h = Math.floor(currentMinutes / 60)
    const m = currentMinutes % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    currentMinutes += interval
  }

  return slots
}

/**
 * Evalúa si una hora dada se encuentra dentro del rango de horas operativas pasadas.
 */
export function isWithinOperationalHours(
  timeStr: string,
  operationalHours?: { start: string; end: string },
): boolean {
  if (!operationalHours || !timeStr) return false
  const timeMins = timeToMinutes(timeStr)
  const startMins = timeToMinutes(operationalHours.start)
  const endMins = timeToMinutes(operationalHours.end)

  return timeMins >= startMins && timeMins <= endMins
}

/**
 * Determina si un punto de tiempo (fecha + hora) no cumple con el tiempo mínimo de reserva anticipada.
 */
export function isTooSoon(dateStr: string, timeStr = '00:00', minAdvanceHours?: number): boolean {
  if (!minAdvanceHours || !dateStr) return false

  const targetDate = new Date(`${dateStr}T${timeStr}:00`)
  const minAllowedDate = new Date(Date.now() + minAdvanceHours * 60 * 60 * 1000)

  return targetDate < minAllowedDate
}

/**
 * Valida si un día entero debe aparecer deshabilitado en la UI (por fecha pasada, disponibilidad o margen mínimo).
 */
export function isDateDisabled(
  dateStr: string,
  config: BookingServiceConfig | undefined,
  serviceId: string,
  minAdvanceHours: number,
  todayStr: string,
  isDayAvailable: (serviceId: string, date: Date) => boolean,
  daySchedule?: DaySchedule,
): boolean {
  if (!dateStr || !config || !serviceId) return false
  if (dateStr < todayStr) return true

  const targetDate = new Date(`${dateStr}T00:00:00`)
  if (!isDayAvailable(serviceId, targetDate)) return true

  // Para days_range, evalúa la hora de Check-in (start) del día seleccionado
  if (config.mode === 'days_range') {
    const checkInTime = daySchedule?.operationalHours?.start
    return isTooSoon(dateStr, checkInTime, minAdvanceHours)
  }

  // Para single_day, evalúa el límite del día (23:59)
  if (config.mode === 'single_day' && isTooSoon(dateStr, '23:59', minAdvanceHours)) {
    return true
  }

  return false
}

/**
 * Valida si un slot/horario específico dentro de un día debe deshabilitarse por aforo o tiempo.
 */
export function isSlotDisabled(
  slot: string,
  dateStr: string,
  config: BookingServiceConfig | undefined,
  bookedCounts: Map<string, number>,
  minAdvanceHours: number,
  todayStr: string,
): boolean {
  if (!config || !dateStr) return true
  if (dateStr < todayStr) return true

  const bookedCount = bookedCounts.get(slot) || 0
  if (config.capacityType === 'single' && bookedCount >= 1) return true
  if (config.capacityType === 'group' && config.maxCapacity && bookedCount >= config.maxCapacity) {
    return true
  }

  if (dateStr === todayStr && slot <= getCurrentTimeStr()) return true

  return isTooSoon(dateStr, slot, minAdvanceHours)
}

/**
 * Convierte un valor numérico en minutos a una representación de tiempo relativo legible para reservas.
 */
export function formatServiceDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  if (minutes < 1440) return `${Math.floor(minutes / 60)} h`
  return `${Math.floor(minutes / 1440)} d`
}

export function isBookingPast(booking: Booking): boolean {
  if (!booking.date) return false

  // Si no tiene hora definida, se asume  el final del día (23:59)
  const timeStr = booking.time || '23:59'
  const bookingDateTime = new Date(`${booking.date}T${timeStr}:00`)

  return bookingDateTime < new Date()
}
