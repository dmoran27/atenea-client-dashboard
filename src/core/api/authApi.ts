export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Reemplazar a futuro: const { data } = await api.post('/auth/login', credentials)
    return Promise.resolve({
      user: {
        id: '1',
        name: 'Diana Morán',
        email: credentials.email,
      },
      token: 'mock-jwt-token-xyz123',
    })
  },

  async me(): Promise<AuthUser> {
    // Reemplazar a futuro: const { data } = await api.get('/auth/me')
    return Promise.resolve({
      id: '1',
      name: 'Diana Morán',
      email: 'cliente@atenea.com',
    })
  },

  async logout(): Promise<void> {
    // Reemplazar a futuro: await api.post('/auth/logout')
    return Promise.resolve()
  },
}
