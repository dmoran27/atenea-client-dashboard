import type { ITenantApi } from './tenant.interface'
import { tenantHttp } from './tenant.http'
import { tenantMock } from './tenant.mock'

const isMockEnabled = import.meta.env.VITE_USE_MOCK === 'true'

export const tenantApi: ITenantApi = isMockEnabled ? tenantMock : tenantHttp

export * from './tenant.interface'
