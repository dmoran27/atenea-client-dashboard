import { z } from 'zod'
import { t } from '@/core/plugins/i18n'

export const getCreateBookingSchema = () =>
  z.object({
    serviceId: z.string().min(1, t('bookings.validation.serviceRequired')),
    clientId: z.string().min(1, t('bookings.validation.clientRequired')),
    clientAlias: z.string().min(2, t('bookings.validation.aliasMin')),
    clientPhone: z.string().min(8, t('bookings.validation.phoneInvalid')),
    clientEmail: z.string().email().min(8, t('bookings.validation.EmailInvalid')),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t('bookings.validation.dateFormat')),
    time: z.string().optional(),
    endTime: z.string().optional(),
    endDate: z.string().optional(),
    notes: z.string().max(500, t('bookings.validation.notesMax')).optional(),
  })

export const getUpdateBookingSchema = () =>
  getCreateBookingSchema()
    .partial()
    .extend({
      status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
    })

export const getCancelBookingSchema = () =>
  z.object({
    reason: z.string().max(250, t('bookings.validation.reasonMax')).optional(),
  })

export type CreateBookingSchema = z.infer<ReturnType<typeof getCreateBookingSchema>>
export type UpdateBookingSchema = z.infer<ReturnType<typeof getUpdateBookingSchema>>
export type CancelBookingSchema = z.infer<ReturnType<typeof getCancelBookingSchema>>
