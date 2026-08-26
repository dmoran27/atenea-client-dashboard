import { coreApi } from '@/core/api/client'
import type {
  IProfileApi,
  UserProfile,
  UserSession,
  UpdateProfilePayload,
  ChangePasswordPayload,
  UpdatePreferencesPayload,
  ToggleTwoFactorPayload,
  MessageResponse,
  TwoFactorResponse,
  AvatarResponse,
} from './profile.interface'

export const profileApiHttp: IProfileApi = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await coreApi.get<UserProfile>('/user/profile')
    return data
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const { data } = await coreApi.put<UserProfile>('/user/profile', payload)
    return data
  },

  async changePassword(payload: ChangePasswordPayload): Promise<MessageResponse> {
    const { data } = await coreApi.post<MessageResponse>('/user/change-password', payload)
    return data
  },

  async updatePreferences(payload: UpdatePreferencesPayload): Promise<UserProfile> {
    const { data } = await coreApi.patch<UserProfile>('/user/preferences', payload)
    return data
  },

  async toggleTwoFactor(payload: ToggleTwoFactorPayload): Promise<TwoFactorResponse> {
    const { data } = await coreApi.post<TwoFactorResponse>('/user/two-factor', payload)
    return data
  },

  async getSessions(): Promise<UserSession[]> {
    const { data } = await coreApi.get<UserSession[]>('/user/sessions')
    return data
  },

  async revokeOtherSessions(): Promise<MessageResponse> {
    const { data } = await coreApi.post<MessageResponse>('/user/sessions/revoke-others')
    return data
  },

  async uploadAvatar(file: File): Promise<AvatarResponse> {
    const formData = new FormData()
    formData.append('avatar', file)
    const { data } = await coreApi.post<AvatarResponse>('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}
