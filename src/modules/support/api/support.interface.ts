export interface Faq {
  id: string
  question: string
  answer: string
  category?: 'booking' | 'payment' | 'account' | 'general'
}

export interface CreateTicketPayload {
  subject: string
  category: 'booking' | 'payment' | 'account'
  service?: string
  message: string
}

export interface TicketResponse {
  id: string
  subject: string
  category: string
  status: 'open' | 'in_progress' | 'closed'
  createdAt: string
}

export interface ISupportApi {
  getFaqs(): Promise<Faq[]>
  createTicket(payload: CreateTicketPayload): Promise<TicketResponse>
}
