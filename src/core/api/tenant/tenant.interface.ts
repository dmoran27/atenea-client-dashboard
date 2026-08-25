export interface TenantInfo {
  id: string
  slug: string
  name: string
  logoUrl?: string
  modules: string[]
}

export interface ITenantApi {
  getTenantConfig(domain: string): Promise<TenantInfo>
}
