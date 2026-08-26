import { formatLocalDate, dateOffset } from '@/core/lib/utils'
import type {
  Booking,
  BookingServiceConfig,
  IBookingApi,
  BookingFilters,
  CreateBookingPayload,
  UpdateBookingPayload,
  CancelBookingPayload,
} from './booking.interface'
export const mockBookingServiceConfigs: BookingServiceConfig[] = [
  // 1. time_slots: Consulta Médica / Nutricional (Individual, intervalos calculados)
  {
    id: 'srv-10000000-0000-4000-8000-000000000001',
    title: 'Consulta Nutricional y Valoración',
    description: 'Evaluación antropométrica completa y plan nutricional personalizado.',
    mode: 'time_slots',
    capacityType: 'single',
    slotDurationMinutes: 45,
    slotIntervalMinutes: 15,
    bufferTimeMinutes: 15,
    disabledDates: [dateOffset(10)],
    disabledHours: [],
    minAdvanceHours: 2,
    maxAdvanceDays: 30,
    cancellationNoticeHours: 12,
    requiresApproval: false,
    weeklySchedules: [
      { dayOfWeek: 1, isOpen: true, operationalHours: { start: '08:00', end: '17:00' } },
      { dayOfWeek: 2, isOpen: true, operationalHours: { start: '08:00', end: '17:00' } },
      { dayOfWeek: 3, isOpen: true, operationalHours: { start: '08:00', end: '17:00' } },
      { dayOfWeek: 4, isOpen: true, operationalHours: { start: '08:00', end: '17:00' } },
      { dayOfWeek: 5, isOpen: true, operationalHours: { start: '08:00', end: '13:00' } },
      { dayOfWeek: 6, isOpen: false },
      { dayOfWeek: 0, isOpen: false },
    ],
  },

  // 2. fixed_classes: Clase de CrossFit / WOD (Grupal, horas fijas con cupos)
  {
    id: 'srv-20000000-0000-4000-8000-000000000002',
    title: 'Clase de Entrenamiento CrossFit WOD',
    description: 'Entrenamiento funcional de alta intensidad grupal con coach en vivo.',
    mode: 'fixed_classes',
    capacityType: 'group',
    maxCapacity: 15,
    slotDurationMinutes: 60,
    disabledDates: [],
    disabledHours: [],
    minAdvanceHours: 1,
    maxAdvanceDays: 14,
    cancellationNoticeHours: 2,
    requiresApproval: false,
    weeklySchedules: [
      { dayOfWeek: 1, isOpen: true, fixedSlots: ['07:00', '09:00', '17:00', '19:00'] },
      { dayOfWeek: 2, isOpen: true, fixedSlots: ['07:00', '09:00', '17:00', '19:00'] },
      { dayOfWeek: 3, isOpen: true, fixedSlots: ['07:00', '09:00', '17:00', '19:00'] },
      { dayOfWeek: 4, isOpen: true, fixedSlots: ['07:00', '09:00', '17:00', '19:00'] },
      { dayOfWeek: 5, isOpen: true, fixedSlots: ['07:00', '09:00', '16:00'] },
      { dayOfWeek: 6, isOpen: true, fixedSlots: ['10:00'] },
      { dayOfWeek: 0, isOpen: false },
    ],
  },

  // 3. single_day: Alquiler de Estudio Fotográfico (Evento/Reserva de todo un día)
  {
    id: 'srv-30000000-0000-4000-8000-000000000003',
    title: 'Alquiler de Estudio Fotográfico y Rodaje',
    description: 'Jornada completa con acceso a ciclorama blanco, iluminación y vestidor.',
    mode: 'single_day',
    capacityType: 'single',
    disabledDates: [dateOffset(7), dateOffset(14)],
    disabledHours: [],
    minAdvanceHours: 24,
    maxAdvanceDays: 60,
    cancellationNoticeHours: 48,
    requiresApproval: true,
    weeklySchedules: [
      { dayOfWeek: 1, isOpen: true, operationalHours: { start: '08:00', end: '20:00' } },
      { dayOfWeek: 2, isOpen: true, operationalHours: { start: '08:00', end: '20:00' } },
      { dayOfWeek: 3, isOpen: true, operationalHours: { start: '08:00', end: '20:00' } },
      { dayOfWeek: 4, isOpen: true, operationalHours: { start: '08:00', end: '20:00' } },
      { dayOfWeek: 5, isOpen: true, operationalHours: { start: '08:00', end: '20:00' } },
      { dayOfWeek: 6, isOpen: true, operationalHours: { start: '09:00', end: '18:00' } },
      { dayOfWeek: 0, isOpen: false },
    ],
  },

  // 4. custom_time_range: Sala de Juntas / Coworking (Rango personalizado dentro del día)
  {
    id: 'srv-40000000-0000-4000-8000-000000000004',
    title: 'Reserva de Sala de Juntas VIP',
    description: 'Sala ejecutiva equipada para videoconferencias, presentaciones y catering.',
    mode: 'custom_time_range',
    capacityType: 'single',
    bufferTimeMinutes: 15,
    disabledDates: [],
    disabledHours: [],
    minAdvanceHours: 4,
    maxAdvanceDays: 45,
    cancellationNoticeHours: 24,
    requiresApproval: false,
    weeklySchedules: [
      { dayOfWeek: 1, isOpen: true, operationalHours: { start: '08:00', end: '20:00' } },
      { dayOfWeek: 2, isOpen: true, operationalHours: { start: '08:00', end: '20:00' } },
      { dayOfWeek: 3, isOpen: true, operationalHours: { start: '08:00', end: '20:00' } },
      { dayOfWeek: 4, isOpen: true, operationalHours: { start: '08:00', end: '20:00' } },
      { dayOfWeek: 5, isOpen: true, operationalHours: { start: '08:00', end: '20:00' } },
      { dayOfWeek: 6, isOpen: true, operationalHours: { start: '09:00', end: '14:00' } },
      { dayOfWeek: 0, isOpen: false },
    ],
  },

  // 5. days_range: Hospedaje en Cabaña / Hotel (Múltiples días)
  {
    id: 'srv-50000000-0000-4000-8000-000000000005',
    title: 'Estadía en Cabaña Alpina Wellness',
    description: 'Alojamiento privado de montaña con zona de spa y tina de hidromasaje.',
    mode: 'days_range',
    capacityType: 'single',
    disabledDates: [dateOffset(12)],
    disabledHours: [],
    minAdvanceHours: 48,
    maxAdvanceDays: 90,
    cancellationNoticeHours: 72,
    requiresApproval: true,
    weeklySchedules: [
      { dayOfWeek: 0, isOpen: true, operationalHours: { start: '15:00', end: '11:00' } },
      { dayOfWeek: 1, isOpen: true, operationalHours: { start: '15:00', end: '11:00' } },
      { dayOfWeek: 2, isOpen: true, operationalHours: { start: '15:00', end: '11:00' } },
      { dayOfWeek: 3, isOpen: true, operationalHours: { start: '15:00', end: '11:00' } },
      { dayOfWeek: 4, isOpen: true, operationalHours: { start: '15:00', end: '11:00' } },
      { dayOfWeek: 5, isOpen: true, operationalHours: { start: '15:00', end: '11:00' } },
      { dayOfWeek: 6, isOpen: true, operationalHours: { start: '15:00', end: '11:00' } },
    ],
  },
]

// Estado mutable en memoria para permitir mutaciones durante la sesión de desarrollo
const mockBookings: Booking[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    number: 'BK-1001',
    serviceId: 'srv-10000000-0000-4000-8000-000000000001',
    clientId: 'cli-9001',
    clientAlias: 'María González',
    clientEmail: 'maria.gonzalez@example.com',
    clientPhone: '+584121234567',
    date: dateOffset(0),
    time: '09:00',
    status: 'confirmed',
    notes: 'Primera sesión de evaluación antropométrica.',
    createdAt: formatLocalDate(dateOffset(-2)),
  },
  {
    id: 'c9bf9e57-1685-4c89-bafb-ff5d7a1d1201',
    number: 'BK-1002',
    serviceId: 'srv-10000000-0000-4000-8000-000000000001',
    clientId: 'cli-9001',
    clientAlias: 'María González',
    clientEmail: 'maria.gonzalez@example.com',
    clientPhone: '+584121234567',
    date: dateOffset(2),
    time: '11:00',
    status: 'pending',
    createdAt: formatLocalDate(dateOffset(-2)),
  },
  {
    id: '7b9e0a12-8f3d-4e5c-9a1b-2c3d4e5f6a7b',
    number: 'BK-1003',
    serviceId: 'srv-20000000-0000-4000-8000-000000000002',
    clientId: 'cli-9002',
    clientAlias: 'Carlos Mendoza',
    clientEmail: 'carlos.mendoza@example.com',
    clientPhone: '+584149876543',
    date: dateOffset(1),
    status: 'confirmed',
    notes: 'Rodaje de campaña comercial. Requiere fondo infinito blanco.',
    createdAt: formatLocalDate(dateOffset(-4)),
  },
  {
    id: 'e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b',
    number: 'BK-1004',
    serviceId: 'srv-30000000-0000-4000-8000-000000000003',
    clientId: 'cli-9003',
    clientAlias: 'Empresa TechCorp',
    clientEmail: 'contacto@techcorp.com',
    clientPhone: '+584245550011',
    date: dateOffset(3),
    time: '14:00',
    endTime: '17:30',
    status: 'confirmed',
    notes: 'Reunión trimestral con inversionistas.',
    createdAt: formatLocalDate(dateOffset(0)),
  },
  {
    id: '8a7b6c5d-4e3f-2a1b-0c9d-8e7f6a5b4c3d',
    number: 'BK-1005',
    serviceId: 'srv-40000000-0000-4000-8000-000000000004',
    clientId: 'cli-9004',
    clientAlias: 'Lucía Fernández',
    clientEmail: 'lucia.fernandez@example.com',
    clientPhone: '+584120001122',
    date: dateOffset(5),
    endDate: dateOffset(8),
    status: 'confirmed',
    notes: 'Escapada de fin de semana.',
    createdAt: formatLocalDate(dateOffset(-2)),
  },
]

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export const bookingMockApi: IBookingApi = {
  async getBookings(filters?: BookingFilters): Promise<Booking[]> {
    await delay()
    let result = [...mockBookings]

    if (filters) {
      if (filters.status && filters.status !== 'all') {
        result = result.filter((b) => b.status === filters.status)
      }
      if (filters.serviceId) {
        result = result.filter((b) => b.serviceId === filters.serviceId)
      }
      if (filters.search) {
        const query = filters.search.toLowerCase()
        result = result.filter(
          (b) =>
            b.number.toLowerCase().includes(query) ||
            b.clientAlias.toLowerCase().includes(query) ||
            b.clientEmail.toLowerCase().includes(query) ||
            b.clientPhone.includes(query) ||
            b.notes?.toLowerCase().includes(query),
        )
      }
      if (filters.startDate) {
        result = result.filter((b) => b.date >= filters.startDate!)
      }
      if (filters.endDate) {
        result = result.filter((b) => b.date <= filters.endDate!)
      }
    }

    return result
  },

  async getBookingById(id: string): Promise<Booking> {
    await delay()
    const booking = mockBookings.find((b) => b.id === id)
    if (!booking) throw new Error('Reserva no encontrada')
    return booking
  },

  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    await delay()
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      number: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      ...payload,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockBookings.unshift(newBooking)
    return newBooking
  },

  async updateBooking(id: string, payload: UpdateBookingPayload): Promise<Booking> {
    await delay()
    const index = mockBookings.findIndex((b) => b.id === id)
    const existing = mockBookings[index]
    if (!existing) throw new Error('Reserva no encontrada')

    const updatedBooking: Booking = {
      ...existing,
      ...payload,
      updatedAt: new Date().toISOString(),
    } as Booking

    mockBookings[index] = updatedBooking
    return updatedBooking
  },

  async cancelBooking(id: string, payload?: CancelBookingPayload): Promise<Booking> {
    await delay()
    const index = mockBookings.findIndex((b) => b.id === id)
    const existing = mockBookings[index]
    if (!existing) throw new Error('Reserva no encontrada')

    const cancelledBooking: Booking = {
      ...existing,
      status: 'cancelled',
      cancellationReason: payload?.reason ?? 'Cancelado por el usuario',
      updatedAt: new Date().toISOString(),
    }

    mockBookings[index] = cancelledBooking
    return cancelledBooking
  },

  async getBookingServiceConfigs(): Promise<BookingServiceConfig[]> {
    await delay(200)
    return mockBookingServiceConfigs
  },

  async getBookingServiceConfigById(id: string): Promise<BookingServiceConfig | undefined> {
    await delay(200)
    return mockBookingServiceConfigs.find((s) => s.id === id)
  },
}
