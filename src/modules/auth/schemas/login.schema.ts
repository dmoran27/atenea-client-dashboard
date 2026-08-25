import { t } from '@/core/plugins/i18n'
import * as z from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
  password: z.string().min(6, t('validation.passwordMin')),
  remember: z.boolean().default(false),
})

export type LoginInput = z.infer<typeof loginSchema>
