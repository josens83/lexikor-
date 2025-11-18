/**
 * React Query Configuration
 * Centralized query client configuration for data fetching
 */

import { QueryClient } from '@tanstack/react-query'
import { message } from 'antd'

/**
 * Create QueryClient with default configuration
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long cached data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Cache time: how long inactive data stays in cache
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

      // Retry failed queries
      retry: 1,

      // Don't refetch on window focus in development
      refetchOnWindowFocus: import.meta.env.PROD,

      // Don't refetch on mount if data is fresh
      refetchOnMount: false,

      // Don't refetch on reconnect if data is fresh
      refetchOnReconnect: false,
    },
    mutations: {
      // Show error message on mutation error
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.detail || '작업에 실패했습니다'
        message.error(errorMessage)
      },
    },
  },
})
