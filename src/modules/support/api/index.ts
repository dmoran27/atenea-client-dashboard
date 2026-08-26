import type { ISupportApi } from './support.interface'
import { supportApiHttp } from './support.http.ts'
import { supportApiMock } from './support.mock'

const isMockEnabled = import.meta.env.VITE_USE_MOCK === 'true'

export const supportApi: ISupportApi = isMockEnabled ? supportApiMock : supportApiHttp

export * from './support.interface'
