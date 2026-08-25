export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  terms?: boolean
}

export interface ForgotPasswordPayload {
  email: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export interface MessageResponse {
  message: string
}

export interface IAuthApi {
  login(credentials: LoginCredentials): Promise<AuthResponse>
  register(payload: RegisterPayload): Promise<AuthResponse>
  forgotPassword(payload: ForgotPasswordPayload): Promise<MessageResponse>
  me(): Promise<AuthUser>
  logout(): Promise<void>
}
