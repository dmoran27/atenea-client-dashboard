import { t } from '@/core/plugins/i18n'
import { z } from 'zod'

export const faqSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  category: z.enum(['booking', 'payment', 'account', 'general']).optional(),
})

export const createTicketSchema = z.object({
  subject: z.string().min(5, { message: t('support.validation.subjectMin') }),
  category: z.enum(['booking', 'payment', 'account'], {
    required_error: t('support.validation.categoryRequired'),
  }),
  service: z.string().optional(),
  message: z.string().min(10, { message: t('support.validation.messageMin') }),
})

export const ticketResponseSchema = z.object({
  id: z.string(),
  subject: z.string(),
  category: z.string(),
  status: z.enum(['open', 'in_progress', 'closed']),
  createdAt: z.string(),
})

export type Faq = z.infer<typeof faqSchema>
export type CreateTicketPayload = z.infer<typeof createTicketSchema>
export type TicketResponse = z.infer<typeof ticketResponseSchema>
