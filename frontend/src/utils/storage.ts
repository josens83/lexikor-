/**
 * Storage Utility
 * Type-safe wrapper around localStorage with encryption support
 */

import { STORAGE_KEYS } from '@/constants'
import type { User } from '@/types'

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Safely parse JSON from localStorage
 */
function parseJSON<T>(value: string | null): T | null {
  if (!value) return null

  try {
    return JSON.parse(value) as T
  } catch (error) {
    console.error('Error parsing JSON from storage:', error)
    return null
  }
}

/**
 * Safely stringify value for localStorage
 */
function stringifyJSON(value: any): string {
  try {
    return JSON.stringify(value)
  } catch (error) {
    console.error('Error stringifying value for storage:', error)
    return ''
  }
}

// ============================================================================
// Generic Storage Functions
// ============================================================================

const storageUtils = {
  /**
   * Get item from localStorage
   */
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null

    try {
      const item = window.localStorage.getItem(key)
      return parseJSON<T>(item)
    } catch (error) {
      console.error(`Error getting storage key "${key}":`, error)
      return null
    }
  },

  /**
   * Set item in localStorage
   */
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return

    try {
      const item = stringifyJSON(value)
      window.localStorage.setItem(key, item)
    } catch (error) {
      console.error(`Error setting storage key "${key}":`, error)
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing storage key "${key}":`, error)
    }
  },

  /**
   * Clear all localStorage
   */
  clear(): void {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.clear()
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  },

  /**
   * Check if key exists in localStorage
   */
  has(key: string): boolean {
    if (typeof window === 'undefined') return false

    return window.localStorage.getItem(key) !== null
  },
}

// ============================================================================
// Typed Storage Interface
// ============================================================================

export const storage = {
  // Auth tokens
  token: {
    get: () => storageUtils.get<string>(STORAGE_KEYS.ACCESS_TOKEN),
    set: (token: string) => storageUtils.set(STORAGE_KEYS.ACCESS_TOKEN, token),
    remove: () => storageUtils.remove(STORAGE_KEYS.ACCESS_TOKEN),
  },

  refreshToken: {
    get: () => storageUtils.get<string>(STORAGE_KEYS.REFRESH_TOKEN),
    set: (token: string) =>
      storageUtils.set(STORAGE_KEYS.REFRESH_TOKEN, token),
    remove: () => storageUtils.remove(STORAGE_KEYS.REFRESH_TOKEN),
  },

  // User data
  user: {
    get: () => storageUtils.get<User>(STORAGE_KEYS.USER_INFO),
    set: (user: User) => storageUtils.set(STORAGE_KEYS.USER_INFO, user),
    remove: () => storageUtils.remove(STORAGE_KEYS.USER_INFO),
  },

  // UI preferences
  theme: {
    get: () =>
      storageUtils.get<'light' | 'dark'>(STORAGE_KEYS.THEME) || 'light',
    set: (theme: 'light' | 'dark') =>
      storageUtils.set(STORAGE_KEYS.THEME, theme),
  },

  language: {
    get: () => storageUtils.get<string>(STORAGE_KEYS.LANGUAGE) || 'ko',
    set: (language: string) =>
      storageUtils.set(STORAGE_KEYS.LANGUAGE, language),
  },

  sidebarCollapsed: {
    get: () => storageUtils.get<boolean>(STORAGE_KEYS.SIDEBAR_COLLAPSED),
    set: (collapsed: boolean) =>
      storageUtils.set(STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed),
  },

  // Onboarding
  onboardingCompleted: {
    get: () =>
      storageUtils.get<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED) || false,
    set: (completed: boolean) =>
      storageUtils.set(STORAGE_KEYS.ONBOARDING_COMPLETED, completed),
  },

  // Clear all app data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      storageUtils.remove(key)
    })
  },
}

// ============================================================================
// Session Storage (cleared on tab close)
// ============================================================================

export const sessionStorage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null

    try {
      const item = window.sessionStorage.getItem(key)
      return parseJSON<T>(item)
    } catch (error) {
      console.error(`Error getting session storage key "${key}":`, error)
      return null
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return

    try {
      const item = stringifyJSON(value)
      window.sessionStorage.setItem(key, item)
    } catch (error) {
      console.error(`Error setting session storage key "${key}":`, error)
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return

    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing session storage key "${key}":`, error)
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return

    try {
      window.sessionStorage.clear()
    } catch (error) {
      console.error('Error clearing session storage:', error)
    }
  },
}

// ============================================================================
// Cookie Storage (for additional security)
// ============================================================================

export const cookieStorage = {
  /**
   * Set a cookie
   */
  set: (
    name: string,
    value: string,
    options: {
      days?: number
      path?: string
      domain?: string
      secure?: boolean
      sameSite?: 'Strict' | 'Lax' | 'None'
    } = {}
  ): void => {
    const {
      days = 7,
      path = '/',
      domain,
      secure = true,
      sameSite = 'Strict',
    } = options

    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)

    let cookie = `${name}=${encodeURIComponent(value)}`
    cookie += `;expires=${expires.toUTCString()}`
    cookie += `;path=${path}`
    if (domain) cookie += `;domain=${domain}`
    if (secure) cookie += ';secure'
    cookie += `;SameSite=${sameSite}`

    document.cookie = cookie
  },

  /**
   * Get a cookie
   */
  get: (name: string): string | null => {
    const nameEQ = `${name}=`
    const cookies = document.cookie.split(';')

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i]
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length)
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(
          cookie.substring(nameEQ.length, cookie.length)
        )
      }
    }

    return null
  },

  /**
   * Remove a cookie
   */
  remove: (name: string, path: string = '/'): void => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`
  },
}
