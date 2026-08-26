import type { IAuthApi } from './auth.interface'
import { authApiHttp } from './auth.http'
import { authApiMock } from './auth.mock'

const isMockEnabled = import.meta.env.VITE_USE_MOCK === 'true'

export const authApi: IAuthApi = isMockEnabled ? authApiMock : authApiHttp
