import { z } from 'zod'

export const orderStatusSchema = z.enum(['paid', 'pending', 'refunded', 'failed'])

export const orderSchema = z.object({
  id: z.string(),
  concept: z.string(),
  date: z.string(),
  amount: z.number().positive(),
  status: orderStatusSchema,
  invoiceUrl: z.string().optional(),
})

export const getOrdersParamsSchema = z.object({
  status: orderStatusSchema.optional(),
})

export type OrderSchema = z.infer<typeof orderSchema>
export type GetOrdersParamsSchema = z.infer<typeof getOrdersParamsSchema>
