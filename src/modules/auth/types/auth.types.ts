import type { LoginCredentials } from '@/core/api/authApi'

export type AuthTab = 'login' | 'signup'

export interface SignupCredentials extends LoginCredentials {
  name: string
  confirmPassword?: string
  acceptTerms: boolean
}
