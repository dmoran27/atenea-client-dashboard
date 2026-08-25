import { coreApi } from '../client'
import type { ITenantApi, TenantInfo } from './tenant.interface'

export const tenantHttp: ITenantApi = {
  async getTenantConfig(domain: string) {
    const { data } = await coreApi.get<TenantInfo>('/public/tenant-config', {
      params: { domain },
    })
    return data
  },
}
