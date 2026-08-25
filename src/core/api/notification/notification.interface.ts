export type NotificationType = 'info' | 'success' | 'warning'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  description: string
  createdAt: Date
  read: boolean
}

export interface INotificationApi {
  getNotifications(): Promise<AppNotification[]>
  markAllAsRead(): Promise<void>
  markAsRead(id: string): Promise<void>
}
