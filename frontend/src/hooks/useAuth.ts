/**
 * useAuth Hook
 * Authentication state management
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User, AuthTokens } from '@/types'
import { STORAGE_KEYS, ROUTES } from '@/constants'
import { storage } from '@/utils/storage'

interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (tokens: AuthTokens, user: User) => void
  logout: () => void
  updateUser: (user: User) => void
  checkAuth: () => Promise<boolean>
}

/**
 * Hook for managing authentication state
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth()
 *
 * // Check if user is logged in
 * if (!isAuthenticated) {
 *   return <Navigate to="/login" />
 * }
 *
 * // Login
 * login(tokens, user)
 *
 * // Logout
 * logout()
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const isAuthenticated = Boolean(user && storage.token.get())

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async (): Promise<boolean> => {
    const token = storage.token.get()
    const savedUser = storage.user.get()

    if (token && savedUser) {
      try {
        // Optionally verify token with backend
        // const response = await authAPI.me()
        // setUser(response.data)

        setUser(savedUser)
        setIsLoading(false)
        return true
      } catch (error) {
        // Token is invalid, clear storage
        storage.token.remove()
        storage.user.remove()
        setUser(null)
        setIsLoading(false)
        return false
      }
    } else {
      setUser(null)
      setIsLoading(false)
      return false
    }
  }, [])

  const login = useCallback(
    (tokens: AuthTokens, userData: User) => {
      // Save tokens
      storage.token.set(tokens.access_token)
      if (tokens.refresh_token) {
        storage.refreshToken.set(tokens.refresh_token)
      }

      // Save user data
      storage.user.set(userData)

      // Update state
      setUser(userData)

      // Navigate to dashboard
      navigate(ROUTES.DASHBOARD)
    },
    [navigate]
  )

  const logout = useCallback(() => {
    // Clear storage
    storage.token.remove()
    storage.refreshToken.remove()
    storage.user.remove()

    // Clear state
    setUser(null)

    // Navigate to login
    navigate(ROUTES.LOGIN)
  }, [navigate])

  const updateUser = useCallback((userData: User) => {
    setUser(userData)
    storage.user.set(userData)
  }, [])

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    checkAuth,
  }
}

/**
 * Hook to check if user has specific role
 *
 * @example
 * const isAdmin = useHasRole('ADMIN')
 */
export function useHasRole(role: string): boolean {
  const { user } = useAuth()
  return user?.role === role
}

/**
 * Hook to check if user has any of the specified roles
 *
 * @example
 * const canManageUsers = useHasAnyRole(['ADMIN', 'LAWYER'])
 */
export function useHasAnyRole(roles: string[]): boolean {
  const { user } = useAuth()
  return user ? roles.includes(user.role) : false
}
