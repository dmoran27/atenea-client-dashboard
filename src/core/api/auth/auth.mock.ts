import type {
  AuthUser,
  LoginCredentials,
  RegisterPayload,
  ForgotPasswordPayload,
  AuthResponse,
  MessageResponse,
} from '@/core/api/auth/auth.interface'

const mockDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

export const authApiMock = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await mockDelay()
    return {
      user: {
        id: '1',
        name: 'Usuario Atenea',
        email: credentials.email,
      },
      token: 'mock-jwt-token-xyz123',
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    await mockDelay()
    return {
      user: {
        id: '2',
        name: payload.name,
        email: payload.email,
      },
      token: 'mock-jwt-token-signup-456',
    }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<MessageResponse> {
    await mockDelay()
    return {
      message: 'Instrucciones enviadas al correo electrónico',
    }
  },

  async me(): Promise<AuthUser> {
    await mockDelay(400)
    return {
      id: '1',
      name: 'Usuario Atenea',
      email: 'cliente@atenea.com',
    }
  },

  async logout(): Promise<void> {
    await mockDelay(300)
  },
}
