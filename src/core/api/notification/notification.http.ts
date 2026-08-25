import { coreApi } from '../client'
import type { AppNotification, INotificationApi } from './notification.interface'

export const notificationHttp: INotificationApi = {
  async getNotifications() {
    const { data } = await coreApi.get<AppNotification[]>('/notifications')
    return data
  },

  async markAllAsRead() {
    await coreApi.patch('/notifications/read-all')
  },

  async markAsRead(id: string) {
    await coreApi.patch(`/notifications/${id}/read`)
  },
}
