import type { INotificationApi } from './notification.interface'
import { mockNotifications } from '@/core/mocks/notification.data'

const mockDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export const notificationMock: INotificationApi = {
  async getNotifications() {
    await mockDelay()
    return [...mockNotifications]
  },

  async markAllAsRead() {
    await mockDelay()
    mockNotifications.forEach((n) => {
      n.read = true
    })
  },

  async markAsRead(id: string) {
    await mockDelay()
    const target = mockNotifications.find((n) => n.id === id)
    if (target) target.read = true
  },
}
