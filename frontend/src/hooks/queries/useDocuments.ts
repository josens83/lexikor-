/**
 * React Query Hooks for Documents
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { documentsAPI } from '@services/api.refactored'
import type { DocumentsAPI } from '@/types'

/**
 * Query keys for document-related queries
 */
export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: () => [...documentKeys.lists()] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: number) => [...documentKeys.details(), id] as const,
}

/**
 * Hook to get all documents
 */
export function useDocuments() {
  return useQuery({
    queryKey: documentKeys.list(),
    queryFn: async () => {
      const response = await documentsAPI.getDocuments()
      return response.data.documents
    },
  })
}

/**
 * Hook to get single document
 */
export function useDocument(id: number) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: async () => {
      const response = await documentsAPI.getDocument(id)
      return response.data.document
    },
    enabled: !!id,
  })
}

/**
 * Hook to upload document
 */
export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => documentsAPI.upload(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() })
      message.success('문서가 업로드되었습니다')
    },
  })
}

/**
 * Hook to analyze document
 */
export function useAnalyzeDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => documentsAPI.analyzeDocument(id),
    onSuccess: (response, id) => {
      queryClient.setQueryData(documentKeys.detail(id), response.data.document)
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() })
      message.success('문서 분석이 완료되었습니다')
    },
  })
}

/**
 * Hook to delete document
 */
export function useDeleteDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => documentsAPI.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() })
      message.success('문서가 삭제되었습니다')
    },
  })
}

/**
 * Hook to share document
 */
export function useShareDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DocumentsAPI.ShareDocumentRequest }) =>
      documentsAPI.shareDocument(id, data),
    onSuccess: (response, { id }) => {
      queryClient.setQueryData(documentKeys.detail(id), response.data.document)
      message.success('문서가 공유되었습니다')
    },
  })
}
