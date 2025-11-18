/**
 * Error Handler Utility
 * Centralized error handling with logging and user feedback
 */

import { message, notification } from 'antd'
import type { ApiError } from '@/types'
import { ERROR_MESSAGES } from '@/constants'

// ============================================================================
// Error Types
// ============================================================================

export interface ErrorOptions {
  silent?: boolean // Don't show UI feedback
  logToConsole?: boolean // Log to console
  logToSentry?: boolean // Send to Sentry
  showNotification?: boolean // Show notification instead of message
  title?: string // Notification title
}

// ============================================================================
// Error Handling Functions
// ============================================================================

/**
 * Extract error message from various error formats
 */
export function getErrorMessage(error: any): string {
  // API error response
  if (error?.response?.data?.detail) {
    return error.response.data.detail
  }

  // Validation errors (422)
  if (error?.response?.status === 422 && error?.response?.data?.errors) {
    const errors = error.response.data.errors
    const firstError = Object.values(errors)[0]
    return Array.isArray(firstError) ? firstError[0] : String(firstError)
  }

  // Axios error
  if (error?.message) {
    return error.message
  }

  // String error
  if (typeof error === 'string') {
    return error
  }

  // Unknown error
  return ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * Get error message based on HTTP status code
 */
export function getErrorMessageByStatus(status: number): string {
  const statusMessages: Record<number, string> = {
    400: '잘못된 요청입니다',
    401: ERROR_MESSAGES.UNAUTHORIZED,
    403: ERROR_MESSAGES.FORBIDDEN,
    404: ERROR_MESSAGES.NOT_FOUND,
    408: ERROR_MESSAGES.TIMEOUT_ERROR,
    422: ERROR_MESSAGES.VALIDATION_ERROR,
    429: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요',
    500: ERROR_MESSAGES.SERVER_ERROR,
    502: '게이트웨이 오류가 발생했습니다',
    503: '서비스를 사용할 수 없습니다',
    504: '게이트웨이 시간 초과',
  }

  return statusMessages[status] || ERROR_MESSAGES.SERVER_ERROR
}

/**
 * Handle API error with user feedback
 */
export function handleApiError(
  error: any,
  customMessage?: string,
  options: ErrorOptions = {}
): string {
  const {
    silent = false,
    logToConsole = import.meta.env.DEV,
    logToSentry = import.meta.env.PROD,
    showNotification = false,
    title,
  } = options

  // Extract error message
  let errorMessage = customMessage || getErrorMessage(error)

  // Handle network errors
  if (!error.response) {
    errorMessage = ERROR_MESSAGES.NETWORK_ERROR
  }
  // Handle status-based errors
  else if (error.response.status) {
    const statusMessage = getErrorMessageByStatus(error.response.status)
    if (!customMessage) {
      errorMessage = statusMessage
    }
  }

  // Log to console in development
  if (logToConsole) {
    console.error('API Error:', {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      error,
    })
  }

  // Log to Sentry in production
  if (logToSentry && typeof window !== 'undefined' && (window as any).Sentry) {
    ;(window as any).Sentry.captureException(error, {
      tags: {
        type: 'api_error',
        status: error.response?.status,
      },
      extra: {
        errorMessage,
        response: error.response?.data,
      },
    })
  }

  // Show user feedback
  if (!silent) {
    if (showNotification) {
      notification.error({
        message: title || '오류',
        description: errorMessage,
        placement: 'topRight',
        duration: 5,
      })
    } else {
      message.error(errorMessage)
    }
  }

  return errorMessage
}

/**
 * Handle validation errors from API (422)
 */
export function handleValidationErrors(
  error: any
): Record<string, string[]> | null {
  if (error?.response?.status === 422 && error?.response?.data?.errors) {
    return error.response.data.errors
  }
  return null
}

/**
 * Convert validation errors to Ant Design form errors
 */
export function validationErrorsToFormErrors(
  errors: Record<string, string[]>
): Array<{ name: string; errors: string[] }> {
  return Object.entries(errors).map(([field, messages]) => ({
    name: field,
    errors: messages,
  }))
}

/**
 * Check if error is a specific HTTP status
 */
export function isErrorStatus(error: any, status: number): boolean {
  return error?.response?.status === status
}

/**
 * Check if error is authentication error
 */
export function isAuthError(error: any): boolean {
  return isErrorStatus(error, 401)
}

/**
 * Check if error is forbidden error
 */
export function isForbiddenError(error: any): boolean {
  return isErrorStatus(error, 403)
}

/**
 * Check if error is not found error
 */
export function isNotFoundError(error: any): boolean {
  return isErrorStatus(error, 404)
}

/**
 * Check if error is validation error
 */
export function isValidationError(error: any): boolean {
  return isErrorStatus(error, 422)
}

/**
 * Check if error is network error
 */
export function isNetworkError(error: any): boolean {
  return !error.response && error.request
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    maxDelay?: number
    factor?: number
    onRetry?: (attempt: number, error: any) => void
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    factor = 2,
    onRetry,
  } = options

  let lastError: any

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Don't retry on client errors (4xx) except 408 and 429
      if (
        error?.response?.status &&
        error.response.status >= 400 &&
        error.response.status < 500 &&
        error.response.status !== 408 &&
        error.response.status !== 429
      ) {
        throw error
      }

      // Last attempt failed
      if (attempt === maxRetries) {
        throw error
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(initialDelay * Math.pow(factor, attempt), maxDelay)

      // Call retry callback
      onRetry?.(attempt + 1, error)

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Create error boundary handler
 */
export function createErrorBoundaryHandler() {
  return (error: Error, errorInfo: { componentStack: string }) => {
    console.error('Error Boundary caught an error:', error, errorInfo)

    // Log to Sentry
    if (import.meta.env.PROD && typeof window !== 'undefined' && (window as any).Sentry) {
      ;(window as any).Sentry.captureException(error, {
        tags: {
          type: 'react_error_boundary',
        },
        extra: {
          componentStack: errorInfo.componentStack,
        },
      })
    }

    // Show error notification
    notification.error({
      message: '오류 발생',
      description: '예상치 못한 오류가 발생했습니다. 페이지를 새로고침해주세요.',
      duration: 0, // Don't auto close
    })
  }
}
