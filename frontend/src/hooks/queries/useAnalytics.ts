/**
 * React Query Hooks for Analytics
 */

import { useQuery, useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { analyticsAPI } from '@services/api.refactored'
import type { AnalyticsAPI } from '@/types'

/**
 * Query keys for analytics-related queries
 */
export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
  usage: () => [...analyticsKeys.all, 'usage'] as const,
}

/**
 * Hook to get dashboard analytics
 */
export function useDashboard() {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: async () => {
      const response = await analyticsAPI.getDashboard()
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get usage analytics
 */
export function useUsageAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.usage(),
    queryFn: async () => {
      const response = await analyticsAPI.getUsageAnalytics()
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to export analytics data
 */
export function useExportData() {
  return useMutation({
    mutationFn: (data: AnalyticsAPI.ExportDataRequest) =>
      analyticsAPI.exportData(data),
    onSuccess: (response) => {
      message.success('데이터 내보내기가 시작되었습니다')

      // If download URL is provided, trigger download
      if (response.data.download_url) {
        window.open(response.data.download_url, '_blank')
      }
    },
  })
}
