import { coreApi } from '@/core/api/client'
import type {
  ICouponsApi,
  Coupon,
  ValidateCouponPayload,
  ValidateCouponResponse,
} from './coupons.interface'

export const couponsApiHttp: ICouponsApi = {
  async getCoupons(): Promise<Coupon[]> {
    const { data } = await coreApi.get<Coupon[]>('/coupons')
    return data
  },

  async validateCoupon(payload: ValidateCouponPayload): Promise<ValidateCouponResponse> {
    const { data } = await coreApi.post<ValidateCouponResponse>('/coupons/validate', payload)
    return data
  },
}
