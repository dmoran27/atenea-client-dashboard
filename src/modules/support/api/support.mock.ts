import type { ISupportApi, Faq, CreateTicketPayload, TicketResponse } from './support.interface'

const mockDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

const mockFaqs: Faq[] = [
  {
    id: 'cancellation',
    category: 'booking',
    question: '¿Cómo puedo cancelar mi reserva?',
    answer:
      'Puedes cancelar tu reserva directamente desde tu panel de usuario en la sección de Reservas hasta 24 horas antes sin penalización.',
  },
  {
    id: 'contact',
    category: 'general',
    question: '¿Cómo contacto directamente con atención al cliente?',
    answer:
      'Puedes enviar un ticket a través de este formulario o escribirnos por correo electrónico a soporte@atenea.dev.',
  },
  {
    id: 'booking',
    category: 'booking',
    question: '¿Puedo modificar la fecha de una reserva confirmada?',
    answer:
      'Sí, la reprogramación está sujeta a la disponibilidad del servicio. Accede a los detalles de tu reserva para ver las fechas disponibles.',
  },
  {
    id: 'payments',
    category: 'payment',
    question: '¿Qué métodos de pago están soportados?',
    answer:
      'Aceptamos tarjetas de crédito, débito y transferencias electrónicas a través de nuestra pasarela de pagos segura.',
  },
]

export const supportApiMock: ISupportApi = {
  async getFaqs(): Promise<Faq[]> {
    await mockDelay(400)
    return [...mockFaqs]
  },

  async createTicket(payload: CreateTicketPayload): Promise<TicketResponse> {
    await mockDelay(600)
    return {
      id: `tkt_${Date.now()}`,
      subject: payload.subject,
      category: payload.category,
      status: 'open',
      createdAt: new Date().toISOString(),
    }
  },
}
