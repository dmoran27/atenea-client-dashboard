import { bookingHttpApi } from './booking.http'
import { bookingMockApi } from './booking.mock'
import type { IBookingApi } from './booking.interface'

const useMocks = import.meta.env.VITE_USE_MOCK === 'true'

export const bookingApi: IBookingApi = useMocks ? bookingMockApi : bookingHttpApi

export * from './booking.interface'
