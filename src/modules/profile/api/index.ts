import type { IProfileApi } from './profile.interface'
import { profileApiHttp } from './profile.http'
import { profileApiMock } from './profile.mock'

const isMockEnabled = import.meta.env.VITE_USE_MOCK === 'true'

export const profileApi: IProfileApi = isMockEnabled ? profileApiMock : profileApiHttp

export * from './profile.interface'
