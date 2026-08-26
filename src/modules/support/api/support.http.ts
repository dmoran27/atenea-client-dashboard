import { coreApi } from '@/core/api/client'
import type { ISupportApi, Faq, CreateTicketPayload, TicketResponse } from './support.interface'

export const supportApiHttp: ISupportApi = {
  async getFaqs(): Promise<Faq[]> {
    const { data } = await coreApi.get<Faq[]>('/support/faqs')
    return data
  },

  async createTicket(payload: CreateTicketPayload): Promise<TicketResponse> {
    const { data } = await coreApi.post<TicketResponse>('/support/tickets', payload)
    return data
  },
}
