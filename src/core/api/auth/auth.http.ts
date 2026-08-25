import { coreApi } from '../client'
import type { IAuthApi } from './auth.interface'
import type {
  LoginCredentials,
  RegisterPayload,
  ForgotPasswordPayload,
} from '@/core/api/auth/auth.interface'

export const authApiReal: IAuthApi = {
  async login(credentials: LoginCredentials) {
    const { data } = await coreApi.post('/auth/login', credentials)
    return data
  },
  async register(payload: RegisterPayload) {
    const { data } = await coreApi.post('/auth/register', payload)
    return data
  },
  async forgotPassword(payload: ForgotPasswordPayload) {
    const { data } = await coreApi.post('/auth/forgot-password', payload)
    return data
  },
  async me() {
    const { data } = await coreApi.get('/auth/me')
    return data
  },
  async logout() {
    await coreApi.post('/auth/logout')
  },
}
