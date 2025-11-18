/**
 * i18n Translation System
 * Simple translation system for Korean language
 */

import ko, { type TranslationKey } from './ko'

type Language = 'ko'

const translations: Record<Language, TranslationKey> = {
  ko,
}

let currentLanguage: Language = 'ko'

/**
 * Get translation by key path
 * @example t('common.save') => '저장'
 * @example t('auth.login') => '로그인'
 */
export function t(keyPath: string, params?: Record<string, string | number>): string {
  const keys = keyPath.split('.')
  let value: any = translations[currentLanguage]

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      console.warn(`Translation key not found: ${keyPath}`)
      return keyPath
    }
  }

  if (typeof value !== 'string') {
    console.warn(`Translation value is not a string: ${keyPath}`)
    return keyPath
  }

  // Replace parameters like {field}, {min}, {max}
  if (params) {
    Object.keys(params).forEach((param) => {
      value = value.replace(new RegExp(`\\{${param}\\}`, 'g'), String(params[param]))
    })
  }

  return value
}

/**
 * Set current language
 */
export function setLanguage(lang: Language) {
  currentLanguage = lang
}

/**
 * Get current language
 */
export function getCurrentLanguage(): Language {
  return currentLanguage
}

/**
 * Export translation object for direct access
 */
export { ko }
export default t
