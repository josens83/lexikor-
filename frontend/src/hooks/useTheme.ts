/**
 * useTheme Hook
 * Dark mode support with system preference detection
 *
 * @module hooks/useTheme
 */

import { useState, useEffect, useCallback } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'lexikor-theme'

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system'
  return (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || 'system'
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(getStoredTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(
    mode === 'system' ? getSystemTheme() : mode
  )

  // Update resolved theme when mode changes
  useEffect(() => {
    const resolved = mode === 'system' ? getSystemTheme() : mode
    setResolvedTheme(resolved)

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', resolved)
    document.body.classList.remove('light-mode', 'dark-mode')
    document.body.classList.add(`${resolved}-mode`)
  }, [mode])

  // Listen for system theme changes
  useEffect(() => {
    if (mode !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light')
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mode])

  const setTheme = useCallback((newMode: ThemeMode) => {
    setMode(newMode)
    localStorage.setItem(THEME_STORAGE_KEY, newMode)
  }, [])

  const toggleTheme = useCallback(() => {
    const nextMode = resolvedTheme === 'light' ? 'dark' : 'light'
    setTheme(nextMode)
  }, [resolvedTheme, setTheme])

  return {
    mode,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    setTheme,
    toggleTheme,
  }
}

export default useTheme
