import type { AppLocale } from '@/core/plugins/i18n'
import type { ThemeMode } from '@/core/types/global'

export interface UserSession {
  id: string
  device: string
  browser: string
  location: string
  ip: string
  current: boolean
  lastActiveAt?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatarUrl?: string
  twoFactorEnabled: boolean
  preferredLocale: AppLocale
  preferredTheme: ThemeMode
  emailNotifications: boolean
  smsNotifications: boolean
}

export interface UpdateProfilePayload {
  name: string
  email: string
  phone: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UpdatePreferencesPayload {
  preferredLocale?: AppLocale
  preferredTheme?: ThemeMode
  emailNotifications?: boolean
  smsNotifications?: boolean
}

export interface ToggleTwoFactorPayload {
  enabled: boolean
}

export interface MessageResponse {
  message: string
}

export interface TwoFactorResponse {
  twoFactorEnabled: boolean
}

export interface AvatarResponse {
  avatarUrl: string
}

export interface IProfileApi {
  getProfile(): Promise<UserProfile>
  updateProfile(payload: UpdateProfilePayload): Promise<UserProfile>
  changePassword(payload: ChangePasswordPayload): Promise<MessageResponse>
  updatePreferences(payload: UpdatePreferencesPayload): Promise<UserProfile>
  toggleTwoFactor(payload: ToggleTwoFactorPayload): Promise<TwoFactorResponse>
  getSessions(): Promise<UserSession[]>
  revokeOtherSessions(): Promise<MessageResponse>
  uploadAvatar(file: File): Promise<AvatarResponse>
}
