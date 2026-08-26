import { bookingApi } from '../client'
import type {
  Booking,
  BookingServiceConfig,
  IBookingApi,
  BookingFilters,
  CreateBookingPayload,
  UpdateBookingPayload,
  CancelBookingPayload,
} from './booking.interface'

export const bookingHttpApi: IBookingApi = {
  async getBookings(filters?: BookingFilters): Promise<Booking[]> {
    const { data } = await bookingApi.get<Booking[]>('/bookings', { params: filters })
    return data
  },

  async getBookingById(id: string): Promise<Booking> {
    const { data } = await bookingApi.get<Booking>(`/bookings/${id}`)
    return data
  },

  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const { data } = await bookingApi.post<Booking>('/bookings', payload)
    return data
  },

  async updateBooking(id: string, payload: UpdateBookingPayload): Promise<Booking> {
    const { data } = await bookingApi.patch<Booking>(`/bookings/${id}`, payload)
    return data
  },

  async cancelBooking(id: string, payload?: CancelBookingPayload): Promise<Booking> {
    const { data } = await bookingApi.post<Booking>(`/bookings/${id}/cancel`, payload)
    return data
  },

  async getBookingServiceConfigs(): Promise<BookingServiceConfig[]> {
    const { data } = await bookingApi.get<BookingServiceConfig[]>('/services')
    return data
  },

  async getBookingServiceConfigById(id: string): Promise<BookingServiceConfig | undefined> {
    const { data } = await bookingApi.get<BookingServiceConfig>(`/services/${id}`)
    return data
  },
}
