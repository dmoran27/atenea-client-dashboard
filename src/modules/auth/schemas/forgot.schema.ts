import * as z from 'zod'
import { t } from '@/core/plugins/i18n'

export const forgotSchema = z.object({
  email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
})

export type ForgotInput = z.infer<typeof forgotSchema>
