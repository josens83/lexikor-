/**
 * Internationalization (i18n) System
 *
 * Supports Korean (ko), English (en), Japanese (ja)
 */

import { ko } from './ko'
import { en } from './en'
import { ja } from './ja'

export type Language = 'ko' | 'en' | 'ja'

export const translations = {
  ko,
  en,
  ja,
}

// Get language from localStorage or browser
const getDefaultLanguage = (): Language => {
  const stored = localStorage.getItem('language') as Language
  if (stored && (stored === 'ko' || stored === 'en' || stored === 'ja')) {
    return stored
  }

  // Detect browser language
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('ko')) return 'ko'
  if (browserLang.startsWith('ja')) return 'ja'
  return 'en' // Default to English
}

let currentLanguage: Language = getDefaultLanguage()

/**
 * Get current language
 */
export function getLanguage(): Language {
  return currentLanguage
}

/**
 * Set current language
 */
export function setLanguage(lang: Language): void {
  currentLanguage = lang
  localStorage.setItem('language', lang)

  // Dispatch custom event for React components to listen
  window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }))
}

/**
 * Translate function with parameter support
 *
 * @param keyPath - Dot-separated path to translation key (e.g., 'common.save')
 * @param params - Optional parameters to replace in translation string
 * @returns Translated string
 *
 * @example
 * t('common.save') // => '저장' (ko) | 'Save' (en) | '保存' (ja)
 * t('errors.required', { field: '이메일' }) // => '이메일은(는) 필수입니다'
 */
export function t(
  keyPath: string,
  params?: Record<string, string | number>
): string {
  const keys = keyPath.split('.')
  let value: any = translations[currentLanguage]

  // Navigate through nested object
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      console.warn(`Translation key not found: ${keyPath} (${currentLanguage})`)
      return keyPath
    }
  }

  // Ensure we have a string value
  if (typeof value !== 'string') {
    console.warn(`Translation value is not a string: ${keyPath}`)
    return keyPath
  }

  // Replace parameters like {field}, {min}, {max}
  if (params) {
    Object.keys(params).forEach((param) => {
      value = value.replace(
        new RegExp(`\\{${param}\\}`, 'g'),
        String(params[param])
      )
    })
  }

  return value
}

/**
 * React hook for translations (optional)
 *
 * Usage:
 * const { t, language, setLanguage } = useTranslation()
 */
export function useTranslation() {
  // In a real implementation, this would use React hooks
  // For now, just return the functions
  return {
    t,
    language: currentLanguage,
    setLanguage,
  }
}

// Export language names for UI
export const languageNames = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
}
