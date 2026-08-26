import type { ITenantApi, TenantInfo } from './tenant.interface'

const mockDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export const tenantMock: ITenantApi = {
  async getTenantConfig(_domain: string): Promise<TenantInfo> {
    await mockDelay()
    return {
      id: 'tenant-123',
      slug: 'barberia-capital',
      name: 'Barbería Capital',
      modules: ['dashboard', 'bookings', 'coupons', 'orders', 'profile', 'support'],
    }
  },
}
