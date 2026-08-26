import { ordersApiHttp } from './orders.http'
import type { IOrdersApi } from './orders.interface'
import { ordersApiMock } from './orders.mock'

const isMockEnabled = import.meta.env.VITE_USE_MOCK === 'true'

export const ordersApi: IOrdersApi = isMockEnabled ? ordersApiMock : ordersApiHttp

export * from './orders.interface'
