import * as z from 'zod'
import { t } from '@/core/plugins/i18n'

export const signupSchema = z
  .object({
    name: z.string().min(1, t('validation.nameRequired')).min(2, t('validation.nameMin')),
    email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
    phone: z.string().min(7, t('validation.phoneRequired')),
    password: z.string().min(6, t('validation.passwordMin')),
    confirmPassword: z.string().min(1, t('validation.confirmPasswordRequired')),
    terms: z.boolean().refine((val) => val === true, t('validation.termsRequired')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('validation.passwordMismatch'),
    path: ['confirmPassword'],
  })

export type SignupInput = z.infer<typeof signupSchema>
