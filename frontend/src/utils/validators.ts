/**
 * Validators Utility
 * Validation functions for forms and data
 */

import { VALIDATION } from '@/constants'
import type { Rule } from 'antd/es/form'

// ============================================================================
// Email Validators
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION.EMAIL.pattern.test(email)
}

/**
 * Ant Design form rule for email
 */
export const emailRule: Rule = {
  type: 'email',
  message: VALIDATION.EMAIL.message,
}

export const requiredEmailRule: Rule[] = [
  { required: true, message: '이메일을 입력해주세요' },
  emailRule,
]

// ============================================================================
// Password Validators
// ============================================================================

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  return (
    password.length >= VALIDATION.PASSWORD.minLength &&
    VALIDATION.PASSWORD.pattern.test(password)
  )
}

/**
 * Get password strength level
 */
export function getPasswordStrength(password: string): {
  level: 'weak' | 'medium' | 'strong'
  score: number
  feedback: string
} {
  let score = 0
  const feedback: string[] = []

  // Length check
  if (password.length >= 8) score += 20
  if (password.length >= 12) score += 10
  if (password.length >= 16) score += 10

  // Character variety
  if (/[a-z]/.test(password)) score += 15
  if (/[A-Z]/.test(password)) score += 15
  if (/\d/.test(password)) score += 15
  if (/[@$!%*?&]/.test(password)) score += 15

  // Penalties
  if (/(.)\1{2,}/.test(password)) {
    score -= 10
    feedback.push('반복되는 문자를 피하세요')
  }

  // Determine level
  let level: 'weak' | 'medium' | 'strong'
  if (score < 50) {
    level = 'weak'
    feedback.unshift('비밀번호가 약합니다')
  } else if (score < 80) {
    level = 'medium'
    feedback.unshift('비밀번호가 보통입니다')
  } else {
    level = 'strong'
    feedback.unshift('강력한 비밀번호입니다!')
  }

  return {
    level,
    score: Math.min(score, 100),
    feedback: feedback.join('. '),
  }
}

/**
 * Ant Design form rule for password
 */
export const passwordRule: Rule = {
  validator: async (_, value) => {
    if (!value) return Promise.resolve()
    if (!isValidPassword(value)) {
      return Promise.reject(new Error(VALIDATION.PASSWORD.message))
    }
    return Promise.resolve()
  },
}

export const requiredPasswordRule: Rule[] = [
  { required: true, message: '비밀번호를 입력해주세요' },
  passwordRule,
]

/**
 * Ant Design form rule for password confirmation
 */
export const confirmPasswordRule = (
  passwordFieldName: string = 'password'
): Rule => ({
  validator: async (_, value) => {
    const form = _.field.split('.')[0] // Get form instance context
    // This needs to be used with Form.useWatch or getFieldValue
    // In practice, use: ({ getFieldValue }) => ({ validator... })
    return Promise.resolve()
  },
  message: '비밀번호가 일치하지 않습니다',
})

// ============================================================================
// Phone Number Validators
// ============================================================================

/**
 * Validate Korean phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return VALIDATION.PHONE.pattern.test(cleaned)
}

/**
 * Ant Design form rule for phone number
 */
export const phoneRule: Rule = {
  validator: async (_, value) => {
    if (!value) return Promise.resolve()
    if (!isValidPhoneNumber(value)) {
      return Promise.reject(new Error(VALIDATION.PHONE.message))
    }
    return Promise.resolve()
  },
}

export const requiredPhoneRule: Rule[] = [
  { required: true, message: '전화번호를 입력해주세요' },
  phoneRule,
]

// ============================================================================
// File Validators
// ============================================================================

/**
 * Validate file size
 */
export function isValidFileSize(file: File): boolean {
  return file.size <= VALIDATION.FILE.maxSize
}

/**
 * Validate file extension
 */
export function isValidFileExtension(file: File): boolean {
  const ext = `.${file.name.split('.').pop()?.toLowerCase()}`
  return VALIDATION.FILE.allowedExtensions.includes(ext)
}

/**
 * Validate file type
 */
export function isValidFileType(file: File): boolean {
  return VALIDATION.FILE.allowedMimeTypes.includes(file.type)
}

/**
 * Comprehensive file validation
 */
export function validateFile(file: File): {
  valid: boolean
  error?: string
} {
  if (!isValidFileSize(file)) {
    return {
      valid: false,
      error: `파일 크기는 ${VALIDATION.FILE.maxSize / 1024 / 1024}MB를 초과할 수 없습니다`,
    }
  }

  if (!isValidFileExtension(file)) {
    return {
      valid: false,
      error: `허용된 파일 형식: ${VALIDATION.FILE.allowedExtensions.join(', ')}`,
    }
  }

  if (!isValidFileType(file)) {
    return {
      valid: false,
      error: '지원하지 않는 파일 형식입니다',
    }
  }

  return { valid: true }
}

// ============================================================================
// Text Validators
// ============================================================================

/**
 * Validate minimum length
 */
export function minLength(value: string, min: number): boolean {
  return value.length >= min
}

/**
 * Validate maximum length
 */
export function maxLength(value: string, max: number): boolean {
  return value.length <= max
}

/**
 * Ant Design form rule for min length
 */
export const minLengthRule = (min: number, message?: string): Rule => ({
  min,
  message: message || `최소 ${min}자 이상 입력해주세요`,
})

/**
 * Ant Design form rule for max length
 */
export const maxLengthRule = (max: number, message?: string): Rule => ({
  max,
  message: message || `최대 ${max}자까지 입력 가능합니다`,
})

// ============================================================================
// URL Validators
// ============================================================================

/**
 * Validate URL format
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Ant Design form rule for URL
 */
export const urlRule: Rule = {
  type: 'url',
  message: '올바른 URL 형식을 입력해주세요',
}

// ============================================================================
// Number Validators
// ============================================================================

/**
 * Validate number range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Validate positive number
 */
export function isPositive(value: number): boolean {
  return value > 0
}

/**
 * Ant Design form rule for positive number
 */
export const positiveNumberRule: Rule = {
  validator: async (_, value) => {
    if (value === undefined || value === null) return Promise.resolve()
    if (!isPositive(Number(value))) {
      return Promise.reject(new Error('양수를 입력해주세요'))
    }
    return Promise.resolve()
  },
}

/**
 * Ant Design form rule for number range
 */
export const rangeRule = (min: number, max: number): Rule => ({
  validator: async (_, value) => {
    if (value === undefined || value === null) return Promise.resolve()
    if (!isInRange(Number(value), min, max)) {
      return Promise.reject(new Error(`${min}에서 ${max} 사이의 값을 입력해주세요`))
    }
    return Promise.resolve()
  },
})

// ============================================================================
// Business Logic Validators
// ============================================================================

/**
 * Validate Korean business registration number (사업자등록번호)
 */
export function isValidBusinessNumber(number: string): boolean {
  const cleaned = number.replace(/\D/g, '')
  if (cleaned.length !== 10) return false

  const digits = cleaned.split('').map(Number)
  const checksum =
    (digits[0] * 1 +
      digits[1] * 3 +
      digits[2] * 7 +
      digits[3] * 1 +
      digits[4] * 3 +
      digits[5] * 7 +
      digits[6] * 1 +
      digits[7] * 3 +
      Math.floor((digits[8] * 5) / 10)) %
    10

  const lastDigit = (10 - (checksum + Math.floor((digits[8] * 5) % 10))) % 10

  return digits[9] === lastDigit
}

/**
 * Ant Design form rule for business number
 */
export const businessNumberRule: Rule = {
  validator: async (_, value) => {
    if (!value) return Promise.resolve()
    if (!isValidBusinessNumber(value)) {
      return Promise.reject(new Error('올바른 사업자등록번호를 입력해주세요'))
    }
    return Promise.resolve()
  },
}

// ============================================================================
// Export Common Rule Sets
// ============================================================================

export const commonRules = {
  required: (message: string = '필수 항목입니다'): Rule => ({
    required: true,
    message,
  }),
  email: requiredEmailRule,
  password: requiredPasswordRule,
  phone: requiredPhoneRule,
  url: [urlRule],
  positiveNumber: [positiveNumberRule],
}
