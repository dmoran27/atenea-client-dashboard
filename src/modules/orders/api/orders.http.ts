import { coreApi } from '@/core/api/client'
import type { IOrdersApi, Order, GetOrdersParams } from './orders.interface'

export const ordersApiHttp: IOrdersApi = {
  async getOrders(params?: GetOrdersParams): Promise<Order[]> {
    const { data } = await coreApi.get<Order[]>('/orders', { params })
    return data
  },

  async getOrderById(id: string): Promise<Order> {
    const { data } = await coreApi.get<Order>(`/orders/${id}`)
    return data
  },
}
