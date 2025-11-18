/**
 * useApiCall Hook
 * Centralized hook for making API calls with loading, error handling, and success callbacks
 */

import { useState, useCallback } from 'react'
import { message } from 'antd'
import type { ApiError } from '@/types'

interface UseApiCallOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
  silent?: boolean // Don't show toast messages
}

interface UseApiCallReturn<T, P extends any[]> {
  loading: boolean
  error: Error | null
  data: T | null
  execute: (...args: P) => Promise<T | null>
  reset: () => void
}

/**
 * Generic hook for API calls with automatic loading and error handling
 *
 * @example
 * const { execute, loading, error } = useApiCall(
 *   async (userId: number) => api.get(`/users/${userId}`),
 *   {
 *     onSuccess: (data) => console.log('Success!', data),
 *     successMessage: '사용자 정보를 불러왔습니다',
 *     errorMessage: '사용자 정보를 불러오는데 실패했습니다',
 *   }
 * )
 *
 * // Call it
 * await execute(123)
 */
export function useApiCall<T, P extends any[] = []>(
  apiFunction: (...args: P) => Promise<{ data: T }>,
  options?: UseApiCallOptions<T>
): UseApiCallReturn<T, P> {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await apiFunction(...args)
        const responseData = response.data

        setData(responseData)

        // Show success message
        if (options?.successMessage && !options?.silent) {
          message.success(options.successMessage)
        }

        // Call success callback
        options?.onSuccess?.(responseData)

        return responseData
      } catch (err: any) {
        const apiError = err as { response?: { data?: ApiError } }
        const errorMessage =
          apiError.response?.data?.detail ||
          options?.errorMessage ||
          '작업에 실패했습니다'

        const error = new Error(errorMessage)
        setError(error)

        // Show error message
        if (!options?.silent) {
          message.error(errorMessage)
        }

        // Call error callback
        options?.onError?.(error)

        // Log to console in development
        if (import.meta.env.DEV) {
          console.error('API Error:', err)
        }

        return null
      } finally {
        setLoading(false)
      }
    },
    [apiFunction, options]
  )

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    loading,
    error,
    data,
    execute,
    reset,
  }
}

/**
 * Simplified version for mutations (POST, PUT, DELETE)
 * Always shows loading state and handles errors
 */
export function useMutation<T, P extends any[] = []>(
  apiFunction: (...args: P) => Promise<{ data: T }>,
  options?: UseApiCallOptions<T>
) {
  return useApiCall(apiFunction, {
    ...options,
    silent: false, // Always show messages for mutations
  })
}

/**
 * Version for queries (GET requests)
 * Can be set to silent for background polling
 */
export function useQuery<T, P extends any[] = []>(
  apiFunction: (...args: P) => Promise<{ data: T }>,
  options?: UseApiCallOptions<T> & { silent?: boolean }
) {
  return useApiCall(apiFunction, {
    ...options,
    silent: options?.silent ?? true, // Silent by default for queries
  })
}
