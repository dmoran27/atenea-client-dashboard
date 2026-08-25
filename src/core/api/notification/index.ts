import type { INotificationApi } from './notification.interface'
import { notificationHttp } from './notification.http'
import { notificationMock } from './notification.mock'

const isMockEnabled = import.meta.env.VITE_USE_MOCK === 'true'

export const notificationApi: INotificationApi = isMockEnabled ? notificationMock : notificationHttp

export * from './notification.interface'
