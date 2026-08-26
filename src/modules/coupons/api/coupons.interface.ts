export type CouponStatus = 'active' | 'expired' | 'used'

export interface Coupon {
  id: string
  code: string
  discount: string
  description: string
  expiresAt: string
  status: CouponStatus
}

export interface ValidateCouponPayload {
  code: string
}

export interface ValidateCouponResponse {
  valid: boolean
  coupon?: Coupon
  message?: string
}

export interface ICouponsApi {
  getCoupons(): Promise<Coupon[]>
  validateCoupon(payload: ValidateCouponPayload): Promise<ValidateCouponResponse>
}
