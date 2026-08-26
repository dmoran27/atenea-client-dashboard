export type OrderStatus = 'paid' | 'pending' | 'refunded' | 'failed'

export interface Order {
  id: string
  concept: string
  date: string
  amount: number
  status: OrderStatus
  invoiceUrl?: string
}

export interface GetOrdersParams {
  status?: OrderStatus
  search?: string
  dateFrom?: string
  dateTo?: string
}

export interface IOrdersApi {
  getOrders(params?: GetOrdersParams): Promise<Order[]>
  getOrderById(id: string): Promise<Order>
}
