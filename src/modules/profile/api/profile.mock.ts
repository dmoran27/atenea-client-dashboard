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

const mockDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

let mockUserProfile: UserProfile = {
  id: 'usr_101',
  name: 'Usuario Atenea',
  email: 'usuario@atenea.dev',
  phone: '+34 612 345 678',
  avatarUrl: '',
  twoFactorEnabled: false,
  preferredLocale: 'es',
  preferredTheme: 'light',
  emailNotifications: true,
  smsNotifications: false,
}

let mockUserSessions: UserSession[] = [
  {
    id: 's1',
    device: 'Laptop',
    browser: 'Chrome · macOS',
    location: 'Madrid, España',
    ip: '192.168.1.24',
    current: true,
  },
  {
    id: 's2',
    device: 'Móvil',
    browser: 'Safari · iPhone',
    location: 'Barcelona, España',
    ip: '192.168.0.16',
    current: false,
  },
]

export const profileApiMock: IProfileApi = {
  async getProfile(): Promise<UserProfile> {
    await mockDelay(400)
    return { ...mockUserProfile }
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    await mockDelay(500)
    mockUserProfile = { ...mockUserProfile, ...payload }
    return { ...mockUserProfile }
  },

  async changePassword(_payload: ChangePasswordPayload): Promise<MessageResponse> {
    await mockDelay(600)
    return { message: 'Contraseña actualizada correctamente' }
  },

  async updatePreferences(payload: UpdatePreferencesPayload): Promise<UserProfile> {
    await mockDelay(300)
    mockUserProfile = { ...mockUserProfile, ...payload }
    return { ...mockUserProfile }
  },

  async toggleTwoFactor(payload: ToggleTwoFactorPayload): Promise<TwoFactorResponse> {
    await mockDelay(400)
    mockUserProfile.twoFactorEnabled = payload.enabled
    return { twoFactorEnabled: payload.enabled }
  },

  async getSessions(): Promise<UserSession[]> {
    await mockDelay(400)
    return [...mockUserSessions]
  },

  async revokeOtherSessions(): Promise<MessageResponse> {
    await mockDelay(500)
    mockUserSessions = mockUserSessions.filter((s) => s.current)
    return { message: 'Otras sesiones cerradas correctamente' }
  },

  async uploadAvatar(file: File): Promise<AvatarResponse> {
    await mockDelay(700)
    const fakeUrl = URL.createObjectURL(file)
    mockUserProfile.avatarUrl = fakeUrl
    return { avatarUrl: fakeUrl }
  },
}
