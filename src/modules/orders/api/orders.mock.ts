import { dateOffset } from '@/core/lib/utils'
import type { IOrdersApi, Order, GetOrdersParams } from './orders.interface'

const mockDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockOrders: Order[] = [
  {
    id: 'ORD-2026-001',
    concept: 'Corte de Cabello + Barba',
    date: dateOffset(-2),
    amount: 45.0,
    status: 'paid',
    invoiceUrl: '#',
  },
  {
    id: 'ORD-2026-002',
    concept: 'Masaje Relajante 60 min',
    date: dateOffset(-5),
    amount: 80.0,
    status: 'paid',
    invoiceUrl: '#',
  },
  {
    id: 'ORD-2026-003',
    concept: 'Manicura Completa',
    date: dateOffset(-8),
    amount: 35.0,
    status: 'pending',
  },
  {
    id: 'ORD-2026-004',
    concept: 'Tratamiento Facial Premium',
    date: dateOffset(-12),
    amount: 120.0,
    status: 'refunded',
    invoiceUrl: '#',
  },
  {
    id: 'ORD-2026-005',
    concept: 'Tinte de Cabello + Mechas',
    date: dateOffset(-15),
    amount: 95.0,
    status: 'failed',
  },
  {
    id: 'ORD-2026-006',
    concept: 'Maquillaje Profesional Evento',
    date: dateOffset(-20),
    amount: 150.0,
    status: 'paid',
    invoiceUrl: '#',
  },
  {
    id: 'ORD-2026-007',
    concept: 'Corte de Cabello Infantil',
    date: dateOffset(-25),
    amount: 25.0,
    status: 'pending',
  },
]

export const ordersApiMock: IOrdersApi = {
  async getOrders(params?: GetOrdersParams): Promise<Order[]> {
    await mockDelay(400)
    let result = [...mockOrders]

    if (params?.status) {
      result = result.filter((o) => o.status === params.status)
    }

    if (params?.search) {
      const q = params.search.toLowerCase()
      result = result.filter(
        (o) => o.id.toLowerCase().includes(q) || o.concept.toLowerCase().includes(q),
      )
    }

    if (params?.dateFrom) {
      result = result.filter((o) => o.date >= params.dateFrom!)
    }

    if (params?.dateTo) {
      result = result.filter((o) => o.date <= params.dateTo!)
    }

    return result
  },

  async getOrderById(id: string): Promise<Order> {
    await mockDelay(300)
    const order = mockOrders.find((o) => o.id === id)
    if (!order) throw new Error(`Order ${id} not found`)
    return { ...order }
  },
}
