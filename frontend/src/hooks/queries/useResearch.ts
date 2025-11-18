/**
 * React Query Hooks for Legal Research (Cases & Statutes)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { researchAPI } from '@services/api.refactored'
import type { ResearchAPI } from '@/types'

/**
 * Query keys for research-related queries
 */
export const researchKeys = {
  all: ['research'] as const,
  cases: () => [...researchKeys.all, 'cases'] as const,
  caseSearch: (params: ResearchAPI.SearchCasesRequest) =>
    [...researchKeys.cases(), 'search', params] as const,
  caseDetail: (id: number) => [...researchKeys.cases(), 'detail', id] as const,
  statutes: () => [...researchKeys.all, 'statutes'] as const,
  statuteSearch: (params: ResearchAPI.SearchStatutesRequest) =>
    [...researchKeys.statutes(), 'search', params] as const,
  statuteDetail: (id: number) => [...researchKeys.statutes(), 'detail', id] as const,
}

/**
 * Hook to search cases
 */
export function useSearchCases(params: ResearchAPI.SearchCasesRequest) {
  return useQuery({
    queryKey: researchKeys.caseSearch(params),
    queryFn: async () => {
      const response = await researchAPI.searchCases(params)
      return response.data
    },
    enabled: !!params.query, // Only run if query is provided
    staleTime: 10 * 60 * 1000, // 10 minutes - search results don't change often
  })
}

/**
 * Hook to search cases with mutation (for form submission)
 */
export function useSearchCasesMutation() {
  return useMutation({
    mutationFn: (params: ResearchAPI.SearchCasesRequest) =>
      researchAPI.searchCases(params),
  })
}

/**
 * Hook to get case detail
 */
export function useCaseDetail(id: number) {
  return useQuery({
    queryKey: researchKeys.caseDetail(id),
    queryFn: async () => {
      const response = await researchAPI.getCaseDetail(id)
      return response.data.case
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes - case details rarely change
  })
}

/**
 * Hook to search statutes
 */
export function useSearchStatutes(params: ResearchAPI.SearchStatutesRequest) {
  return useQuery({
    queryKey: researchKeys.statuteSearch(params),
    queryFn: async () => {
      const response = await researchAPI.searchStatutes(params)
      return response.data
    },
    enabled: !!params.query,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook to search statutes with mutation (for form submission)
 */
export function useSearchStatutesMutation() {
  return useMutation({
    mutationFn: (params: ResearchAPI.SearchStatutesRequest) =>
      researchAPI.searchStatutes(params),
  })
}

/**
 * Hook to get statute detail
 */
export function useStatuteDetail(id: number) {
  return useQuery({
    queryKey: researchKeys.statuteDetail(id),
    queryFn: async () => {
      const response = await researchAPI.getStatuteDetail(id)
      return response.data.statute
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}
