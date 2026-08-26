import { dateOffset } from '@/core/lib/utils'
import type {
  ICouponsApi,
  Coupon,
  ValidateCouponPayload,
  ValidateCouponResponse,
} from './coupons.interface'

const mockDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

const mockCoupons: Coupon[] = [
  {
    id: 'c1',
    code: 'ATENEA20',
    discount: '20% OFF',
    description: 'Descuento en todos los servicios de peluquería',
    expiresAt: dateOffset(30),
    status: 'active',
  },
  {
    id: 'c2',
    code: 'BIENVENIDA10',
    discount: '10% OFF',
    description: 'Descuento de bienvenida en tu primera reserva',
    expiresAt: dateOffset(60),
    status: 'active',
  },
  {
    id: 'c3',
    code: 'VERANO2026',
    discount: '15% OFF',
    description: 'Promoción de temporada en tratamientos faciales',
    expiresAt: dateOffset(-5),
    status: 'expired',
  },
  {
    id: 'c4',
    code: 'VIPMASAJE',
    discount: '25% OFF',
    description: 'Descuento exclusivo en masajes relajantes',
    expiresAt: dateOffset(-10),
    status: 'used',
  },
  {
    id: 'c5',
    code: 'FLASH50',
    discount: '50% OFF',
    description: 'Oferta flash por 24 horas en manicura',
    expiresAt: dateOffset(1),
    status: 'active',
  },
]

export const couponsApiMock: ICouponsApi = {
  async getCoupons(): Promise<Coupon[]> {
    await mockDelay(400)
    return [...mockCoupons]
  },

  async validateCoupon(payload: ValidateCouponPayload): Promise<ValidateCouponResponse> {
    await mockDelay(500)
    const found = mockCoupons.find(
      (c) => c.code.toUpperCase() === payload.code.trim().toUpperCase(),
    )

    if (!found) {
      return { valid: false, message: 'coupons.validation.notFound' }
    }
    if (found.status === 'expired') {
      return { valid: false, message: 'coupons.validation.expired' }
    }
    if (found.status === 'used') {
      return { valid: false, message: 'coupons.validation.alreadyUsed' }
    }

    return { valid: true, coupon: found }
  },
}
