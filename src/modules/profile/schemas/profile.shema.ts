import { t } from '@/core/plugins/i18n'
import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(2, t('profile.validation.nameMin')),
  email: z.string().email(t('profile.validation.emailInvalid')),
  phone: z.string().min(7, t('profile.validation.phoneInvalid')),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, t('profile.validation.currentPasswordRequired')),
    newPassword: z.string().min(8, t('profile.validation.passwordMin')),
    confirmPassword: z.string().min(1, t('profile.validation.confirmPasswordRequired')),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: t('profile.validation.passwordsMismatch'),
    path: ['confirmPassword'],
  })

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
