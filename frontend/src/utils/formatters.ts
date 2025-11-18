/**
 * Formatters Utility
 * Helper functions for formatting data for display
 */

// ============================================================================
// Date/Time Formatters
// ============================================================================

/**
 * Format date to Korean format
 * @example formatDate('2024-01-15T10:30:00Z') => '2024년 1월 15일'
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${year}년 ${month}월 ${day}일`
}

/**
 * Format datetime to Korean format
 * @example formatDateTime('2024-01-15T10:30:00Z') => '2024년 1월 15일 오전 10:30'
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const dateStr = formatDate(d)
  const hour = d.getHours()
  const minute = d.getMinutes().toString().padStart(2, '0')
  const period = hour < 12 ? '오전' : '오후'
  const displayHour = hour % 12 || 12
  return `${dateStr} ${period} ${displayHour}:${minute}`
}

/**
 * Format relative time (e.g., "2시간 전", "3일 전")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 60) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay < 30) return `${diffDay}일 전`
  if (diffMonth < 12) return `${diffMonth}개월 전`
  return `${diffYear}년 전`
}

// ============================================================================
// Number Formatters
// ============================================================================

/**
 * Format number with thousands separator
 * @example formatNumber(1234567) => '1,234,567'
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR')
}

/**
 * Format currency (KRW)
 * @example formatCurrency(99000) => '₩99,000'
 */
export function formatCurrency(amount: number, currency: string = 'KRW'): string {
  if (currency === 'KRW') {
    return `₩${formatNumber(amount)}`
  }
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format file size
 * @example formatFileSize(1536) => '1.5 KB'
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Format percentage
 * @example formatPercentage(0.156) => '15.6%'
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

// ============================================================================
// String Formatters
// ============================================================================

/**
 * Format phone number
 * @example formatPhoneNumber('01012345678') => '010-1234-5678'
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

/**
 * Truncate string with ellipsis
 * @example truncate('Long text here', 10) => 'Long text...'
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}...`
}

/**
 * Capitalize first letter
 * @example capitalize('hello world') => 'Hello world'
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convert to title case
 * @example toTitleCase('hello world') => 'Hello World'
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ')
}

// ============================================================================
// Subscription Plan Formatters
// ============================================================================

/**
 * Format subscription plan name
 */
export function formatPlanName(plan: string): string {
  const planNames: Record<string, string> = {
    FREE: '무료',
    PROFESSIONAL: '프로페셔널',
    ENTERPRISE: '엔터프라이즈',
  }
  return planNames[plan] || plan
}

/**
 * Format subscription status
 */
export function formatSubscriptionStatus(status: string): string {
  const statusNames: Record<string, string> = {
    ACTIVE: '활성',
    INACTIVE: '비활성',
    CANCELLED: '취소됨',
    EXPIRED: '만료됨',
    TRIAL: '체험',
  }
  return statusNames[status] || status
}

// ============================================================================
// Document Type Formatters
// ============================================================================

/**
 * Format document type
 */
export function formatDocumentType(type: string): string {
  const typeNames: Record<string, string> = {
    CONTRACT: '계약서',
    LAWSUIT: '소장',
    OPINION: '법률의견서',
    NOTICE: '내용증명',
    COURT_DECISION: '판결문',
    STATUTE: '법령',
    OTHER: '기타',
  }
  return typeNames[type] || type
}

/**
 * Format document status
 */
export function formatDocumentStatus(status: string): string {
  const statusNames: Record<string, string> = {
    UPLOADING: '업로드 중',
    PROCESSING: '처리 중',
    COMPLETED: '완료',
    FAILED: '실패',
  }
  return statusNames[status] || status
}

// ============================================================================
// Risk Score Formatter
// ============================================================================

/**
 * Format risk score with color
 */
export function formatRiskScore(score: number): {
  text: string
  color: string
  level: 'low' | 'medium' | 'high'
} {
  if (score < 30) {
    return { text: '낮음', color: '#52c41a', level: 'low' }
  } else if (score < 70) {
    return { text: '중간', color: '#faad14', level: 'medium' }
  } else {
    return { text: '높음', color: '#ff4d4f', level: 'high' }
  }
}

// ============================================================================
// User Role Formatter
// ============================================================================

/**
 * Format user role
 */
export function formatUserRole(role: string): string {
  const roleNames: Record<string, string> = {
    USER: '일반 사용자',
    LAWYER: '변호사',
    ADMIN: '관리자',
    ENTERPRISE: '기업 사용자',
  }
  return roleNames[role] || role
}

// ============================================================================
// Legal Area Formatter
// ============================================================================

/**
 * Get icon for legal area
 */
export function getLegalAreaIcon(area?: string): string {
  const icons: Record<string, string> = {
    민사: '⚖️',
    형사: '👨‍⚖️',
    상사: '💼',
    노동: '👷',
    가족: '👨‍👩‍👧‍👦',
    행정: '🏛️',
    세무: '💰',
    지적재산: '💡',
  }
  return icons[area || ''] || '📋'
}
