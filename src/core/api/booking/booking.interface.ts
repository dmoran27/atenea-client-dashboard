export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export type BookingMode =
  | 'time_slots' // Franjas calculadas automáticamente por intervalo
  | 'fixed_classes' // Horarios/clases con horas fijas específicas
  | 'single_day' // Evento de todo un día
  | 'custom_time_range' // Rango personalizado dentro del día
  | 'days_range' // Estancias o rangos de múltiples días

export type CapacityType = 'single' | 'group' | 'unlimited'

export interface DaySchedule {
  dayOfWeek: number // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  isOpen: boolean
  operationalHours?: { start: string; end: string }
  fixedSlots?: string[] // Si el modo es 'fixed_classes' (ej. ['07:00', '08:00', '18:00'])
}

export interface BookingServiceConfig {
  id: string
  title: string
  description: string
  mode: BookingMode

  // Capacidad y Aforo
  capacityType: CapacityType
  maxCapacity?: number // ej. 15 cupos para CrossFit (ignorado si es 'single')

  // Configuración de Horarios
  weeklySchedules: DaySchedule[]
  slotDurationMinutes?: number // Duración real de la actividad
  slotIntervalMinutes?: number // Frecuencia de generación de slots
  bufferTimeMinutes?: number // Tiempo de descanso entre reservas

  // Excepciones
  disabledDates: string[] // Fechas específicas bloqueadas (YYYY-MM-DD)
  disabledHours: string[] // Fechas específicas bloqueadas (YYYY-MM-DD)

  // Reglas de Negocio
  minAdvanceHours?: number // Mínimo N horas antes para reservar
  maxAdvanceDays?: number // Máximo N días hacia el futuro
  cancellationNoticeHours?: number // Límite de tiempo para cancelar/reagendar
  requiresApproval?: boolean // ¿Requiere validación manual del admin?
}

export interface Booking {
  id: string
  number: string
  serviceId: string
  clientId: string
  clientAlias: string
  clientEmail: string
  clientPhone: string
  date: string // YYYY-MM-DD
  time?: string // HH:mm
  endTime?: string // HH:mm
  endDate?: string // YYYY-MM-DD
  status: BookingStatus
  notes?: string
  cancellationReason?: string
  createdAt?: string
  updatedAt?: string
}

export interface BookingFilters {
  status?: BookingStatus | 'all'
  serviceId?: string
  search?: string
  startDate?: string
  endDate?: string
}

export interface CreateBookingPayload {
  serviceId: string
  clientId: string
  clientAlias: string
  clientEmail: string
  clientPhone: string
  date: string
  time?: string
  endTime?: string
  endDate?: string
  notes?: string
}

export interface UpdateBookingPayload extends Partial<CreateBookingPayload> {
  status?: BookingStatus
}

export interface CancelBookingPayload {
  reason?: string
}

export interface IBookingApi {
  getBookings(filters?: BookingFilters): Promise<Booking[]>
  getBookingById(id: string): Promise<Booking>
  createBooking(payload: CreateBookingPayload): Promise<Booking>
  updateBooking(id: string, payload: UpdateBookingPayload): Promise<Booking>
  cancelBooking(id: string, payload?: CancelBookingPayload): Promise<Booking>
  getBookingServiceConfigs(): Promise<BookingServiceConfig[]>
  getBookingServiceConfigById(id: string): Promise<BookingServiceConfig | undefined>
}
