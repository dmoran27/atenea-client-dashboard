import { t } from '@/core/plugins/i18n'
import { z } from 'zod'

export const couponSchema = z.object({
  id: z.string(),
  code: z.string(),
  discount: z.string(),
  description: z.string(),
  expiresAt: z.string(),
  status: z.enum(['active', 'expired', 'used']),
})

export const validateCouponSchema = z.object({
  code: z
    .string()
    .min(3, { message: t('coupons.validation.codeMin') })
    .max(20, { message: t('coupons.validation.codeMax') }),
})

export type ValidateCouponPayload = z.infer<typeof validateCouponSchema>
