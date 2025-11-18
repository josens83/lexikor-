/**
 * React Query Hooks for Authentication
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { authAPI } from '@services/api.refactored'
import { storage } from '@utils/storage'
import { ROUTES } from '@constants'
import type { User, AuthAPI } from '@types'

/**
 * Query keys for auth-related queries
 */
export const authKeys = {
  me: ['auth', 'me'] as const,
  profile: ['auth', 'profile'] as const,
}

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      const response = await authAPI.getMe()
      return response.data.user
    },
    enabled: !!storage.token.get(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AuthAPI.UpdateProfileRequest) => authAPI.updateProfile(data),
    onSuccess: (response) => {
      queryClient.setQueryData(authKeys.me, response.data.user)
      message.success('프로필이 업데이트되었습니다')
    },
  })
}

/**
 * Hook to change password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: AuthAPI.ChangePasswordRequest) => authAPI.changePassword(data),
    onSuccess: () => {
      message.success('비밀번호가 변경되었습니다')
    },
  })
}

/**
 * Hook to enable MFA
 */
export function useEnableMFA() {
  return useMutation({
    mutationFn: () => authAPI.enableMFA(),
    onSuccess: () => {
      message.success('2단계 인증이 활성화되었습니다')
    },
  })
}

/**
 * Hook to disable MFA
 */
export function useDisableMFA() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authAPI.disableMFA(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me })
      message.success('2단계 인증이 비활성화되었습니다')
    },
  })
}

/**
 * Hook to delete account
 */
export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => authAPI.deleteAccount(),
    onSuccess: () => {
      storage.clearAll()
      message.success('계정이 삭제되었습니다')
      window.location.href = ROUTES.HOME
    },
  })
}

/**
 * Hook to login
 */
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AuthAPI.LoginRequest) => authAPI.login(data),
    onSuccess: (response) => {
      const { access_token, refresh_token } = response.data
      storage.token.set(access_token)
      if (refresh_token) {
        storage.refreshToken.set(refresh_token)
      }
      queryClient.invalidateQueries({ queryKey: authKeys.me })
      message.success('로그인되었습니다')
    },
  })
}

/**
 * Hook to logout
 */
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      storage.clearAll()
      queryClient.clear()
      message.success('로그아웃되었습니다')
      window.location.href = ROUTES.LOGIN
    },
  })
}

/**
 * Hook to register
 */
export function useRegister() {
  return useMutation({
    mutationFn: (data: AuthAPI.RegisterRequest) => authAPI.register(data),
    onSuccess: () => {
      message.success('회원가입이 완료되었습니다. 이메일을 확인해주세요')
    },
  })
}
