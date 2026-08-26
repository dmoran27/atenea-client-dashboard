import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { profileApi } from '../api'
import type {
  UpdateProfilePayload,
  ChangePasswordPayload,
  UpdatePreferencesPayload,
  ToggleTwoFactorPayload,
} from '../api'

export const PROFILE_KEYS = {
  all: ['profile'] as const,
  user: () => [...PROFILE_KEYS.all, 'user'] as const,
  sessions: () => [...PROFILE_KEYS.all, 'sessions'] as const,
}

export function useProfile() {
  const queryClient = useQueryClient()

  // Queries
  const profileQuery = useQuery({
    queryKey: PROFILE_KEYS.user(),
    queryFn: () => profileApi.getProfile(),
  })

  const sessionsQuery = useQuery({
    queryKey: PROFILE_KEYS.sessions(),
    queryFn: () => profileApi.getSessions(),
  })

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileApi.updateProfile(payload),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(PROFILE_KEYS.user(), updatedProfile)
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (payload: ChangePasswordPayload) => profileApi.changePassword(payload),
  })

  const updatePreferencesMutation = useMutation({
    mutationFn: (payload: UpdatePreferencesPayload) => profileApi.updatePreferences(payload),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(PROFILE_KEYS.user(), updatedProfile)
    },
  })

  const toggleTwoFactorMutation = useMutation({
    mutationFn: (payload: ToggleTwoFactorPayload) => profileApi.toggleTwoFactor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.user() })
    },
  })

  const revokeSessionsMutation = useMutation({
    mutationFn: () => profileApi.revokeOtherSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.sessions() })
    },
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => profileApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.user() })
    },
  })

  return {
    // Data & States
    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
    isErrorProfile: profileQuery.isError,
    sessions: sessionsQuery.data,
    isLoadingSessions: sessionsQuery.isLoading,

    // Actions
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,

    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,

    updatePreferences: updatePreferencesMutation.mutateAsync,
    isUpdatingPreferences: updatePreferencesMutation.isPending,

    toggleTwoFactor: toggleTwoFactorMutation.mutateAsync,
    isTogglingTwoFactor: toggleTwoFactorMutation.isPending,

    revokeOtherSessions: revokeSessionsMutation.mutateAsync,
    isRevokingSessions: revokeSessionsMutation.isPending,

    uploadAvatar: uploadAvatarMutation.mutateAsync,
    isUploadingAvatar: uploadAvatarMutation.isPending,
  }
}
