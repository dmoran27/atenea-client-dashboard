import type { ICouponsApi } from './coupons.interface'
import { couponsApiHttp } from './coupons.http'
import { couponsApiMock } from './coupons.mock'

const isMockEnabled = import.meta.env.VITE_USE_MOCK === 'true'

export const couponsApi: ICouponsApi = isMockEnabled ? couponsApiMock : couponsApiHttp

export * from './coupons.interface'
