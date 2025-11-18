/**
 * Application Constants
 * Centralized constants to avoid magic strings and numbers
 */

// ============================================================================
// API Configuration
// ============================================================================

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    ME: '/api/v1/auth/me',
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    MFA_ENABLE: '/api/v1/auth/mfa/enable',
    MFA_VERIFY: '/api/v1/auth/mfa/verify',
    MFA_DISABLE: '/api/v1/auth/mfa/disable',
  },
  BILLING: {
    SUBSCRIPTION: '/api/v1/billing/subscription',
    UPGRADE: '/api/v1/billing/upgrade',
    CANCEL: '/api/v1/billing/cancel',
    PAYMENT_METHODS: '/api/v1/billing/payment-methods',
    INVOICES: '/api/v1/billing/invoices',
    USAGE: '/api/v1/billing/usage',
  },
  CHAT: {
    CONVERSATIONS: '/api/v1/chat/conversations',
    MESSAGES: (conversationId: number) => `/api/v1/chat/conversations/${conversationId}/messages`,
  },
  DOCUMENTS: {
    LIST: '/api/v1/documents',
    UPLOAD: '/api/v1/documents/upload',
    DETAIL: (id: number) => `/api/v1/documents/${id}`,
    ANALYZE: (id: number) => `/api/v1/documents/${id}/analyze`,
    DOWNLOAD: (id: number) => `/api/v1/documents/${id}/download`,
  },
  RESEARCH: {
    SEARCH_CASES: '/api/v1/research/cases/search',
    SEARCH_STATUTES: '/api/v1/research/statutes/search',
    CASE_DETAIL: (id: number) => `/api/v1/research/cases/${id}`,
    STATUTE_DETAIL: (id: number) => `/api/v1/research/statutes/${id}`,
  },
  TEMPLATES: {
    LIST: '/api/v1/templates',
    DETAIL: (id: number) => `/api/v1/templates/${id}`,
    GENERATE: '/api/v1/templates/generate',
  },
  ANALYTICS: {
    DASHBOARD: '/api/v1/analytics/dashboard',
    USAGE: '/api/v1/analytics/usage',
    EXPORT: '/api/v1/analytics/export',
  },
  ADMIN: {
    USERS: '/api/v1/admin/users',
    USER_DETAIL: (id: number) => `/api/v1/admin/users/${id}`,
    STATS: '/api/v1/admin/stats',
  },
  HEALTH: {
    CHECK: '/api/v1/health',
    STATUS: '/api/v1/health/status',
  },
} as const

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
} as const

// ============================================================================
// Route Paths
// ============================================================================

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  CHAT: '/chat',
  DOCUMENTS: '/documents',
  RESEARCH: '/research',
  TEMPLATES: '/templates',

  SETTINGS: '/settings',
  BILLING: '/billing',
  BILLING_HISTORY: '/billing/history',
  USAGE_ANALYTICS: '/analytics/usage',

  HELP_CENTER: '/help',
  FAQ: '/faq',
  API_DOCS: '/api-docs',
  SERVICE_STATUS: '/status',

  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
  },

  LEGAL: {
    PRIVACY: '/privacy',
    TERMS: '/terms',
  },

  ERROR: {
    NOT_FOUND: '/404',
    SERVER_ERROR: '/500',
  },
} as const

// ============================================================================
// UI Constants
// ============================================================================

export const UI = {
  SIDEBAR_WIDTH: 250,
  SIDEBAR_COLLAPSED_WIDTH: 80,
  HEADER_HEIGHT: 64,
  FOOTER_HEIGHT: 64,

  MAX_CONTENT_WIDTH: 1400,

  BREAKPOINTS: {
    XS: 480,
    SM: 576,
    MD: 768,
    LG: 992,
    XL: 1200,
    XXL: 1600,
  },

  ANIMATION_DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
} as const

// ============================================================================
// Theme Colors
// ============================================================================

export const COLORS = {
  PRIMARY: '#1890ff',
  SUCCESS: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#ff4d4f',
  INFO: '#1890ff',

  TEXT_PRIMARY: 'rgba(0, 0, 0, 0.85)',
  TEXT_SECONDARY: 'rgba(0, 0, 0, 0.65)',
  TEXT_DISABLED: 'rgba(0, 0, 0, 0.25)',

  BG_PRIMARY: '#ffffff',
  BG_SECONDARY: '#f0f2f5',
  BG_TERTIARY: '#fafafa',

  BORDER: '#d9d9d9',
  BORDER_LIGHT: '#f0f0f0',

  GRADIENT_PRIMARY: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  GRADIENT_SUCCESS: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
  GRADIENT_WARNING: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
  GRADIENT_ERROR: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
} as const

// ============================================================================
// Subscription Plans
// ============================================================================

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: '무료',
    price: 0,
    queryLimit: 20,
    documentLimit: 5,
    features: [
      '월 20회 AI 질의',
      '문서 5개 저장',
      '기본 문서 분석',
      '커뮤니티 지원',
    ],
  },
  PROFESSIONAL: {
    name: '프로페셔널',
    price: 99000,
    queryLimit: -1, // unlimited
    documentLimit: 100,
    features: [
      '무제한 AI 질의',
      '문서 100개 저장',
      '고급 문서 분석',
      '판례/법령 검색',
      '문서 템플릿',
      '우선 지원',
    ],
  },
  ENTERPRISE: {
    name: '엔터프라이즈',
    price: null, // custom pricing
    queryLimit: -1,
    documentLimit: -1,
    features: [
      '모든 프로페셔널 기능',
      '무제한 문서 저장',
      'API 액세스',
      '전담 지원',
      'SLA 보장',
      '커스텀 통합',
      'On-premise 옵션',
    ],
  },
} as const

// ============================================================================
// Validation Rules
// ============================================================================

export const VALIDATION = {
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: '올바른 이메일 형식을 입력해주세요',
  },
  PASSWORD: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: '비밀번호는 8자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다',
  },
  PHONE: {
    pattern: /^01[0-9]-?\d{3,4}-?\d{4}$/,
    message: '올바른 전화번호 형식을 입력해주세요',
  },
  FILE: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedExtensions: ['.pdf', '.docx', '.doc', '.hwp', '.txt'],
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/haansofthwp',
      'text/plain',
    ],
  },
} as const

// ============================================================================
// Pagination
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
  UNAUTHORIZED: '로그인이 필요합니다',
  FORBIDDEN: '접근 권한이 없습니다',
  NOT_FOUND: '요청하신 페이지를 찾을 수 없습니다',
  VALIDATION_ERROR: '입력 정보를 확인해주세요',
  TIMEOUT_ERROR: '요청 시간이 초과되었습니다',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다',
} as const

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  LOGIN: '로그인되었습니다',
  LOGOUT: '로그아웃되었습니다',
  REGISTER: '회원가입이 완료되었습니다',
  PASSWORD_RESET: '비밀번호가 재설정되었습니다',
  EMAIL_SENT: '이메일이 전송되었습니다',
  SAVED: '저장되었습니다',
  DELETED: '삭제되었습니다',
  UPDATED: '업데이트되었습니다',
} as const

// ============================================================================
// Feature Flags
// ============================================================================

export const FEATURES = {
  ENABLE_MFA: true,
  ENABLE_OAUTH: true,
  ENABLE_ANALYTICS: true,
  ENABLE_SENTRY: import.meta.env.PROD,
  ENABLE_CHAT: true,
  ENABLE_DOCUMENT_ANALYSIS: true,
  ENABLE_RESEARCH: true,
  ENABLE_TEMPLATES: true,
} as const

// ============================================================================
// Analytics Events
// ============================================================================

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  LOGIN: 'login',
  REGISTER: 'register',
  LOGOUT: 'logout',
  SUBSCRIPTION_UPGRADE: 'subscription_upgrade',
  DOCUMENT_UPLOAD: 'document_upload',
  DOCUMENT_ANALYZE: 'document_analyze',
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  RESEARCH_SEARCH: 'research_search',
  TEMPLATE_GENERATE: 'template_generate',
  ERROR_OCCURRED: 'error_occurred',
} as const

// ============================================================================
// Local Storage Limits
// ============================================================================

export const STORAGE_LIMITS = {
  MAX_CACHE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_CACHE_ITEMS: 100,
  CACHE_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
} as const
