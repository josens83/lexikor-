/**
 * React Query Hooks for Chat & Conversations
 * Updated to match backend API structure
 *
 * @module hooks/queries/useChat
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { api } from '@services/api.refactored'
import type { Message, Conversation } from '@/types'
import type { SendMessageRequest, SendMessageResponse, LegalArea } from '@/types/chat'

// ============================================================================
// Query Keys
// ============================================================================

export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  conversation: (id: number) => [...chatKeys.all, 'conversation', id] as const,
  messages: (conversationId: number) => [...chatKeys.all, 'messages', conversationId] as const,
}

// ============================================================================
// API Functions (matching backend endpoints)
// ============================================================================

const chatApiClient = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get('/api/v1/chat/conversations')
    return response.data
  },

  getMessages: async (conversationId: number): Promise<{ messages: Message[], title: string }> => {
    const response = await api.get(`/api/v1/chat/conversations/${conversationId}/messages`)
    return response.data
  },

  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await api.post('/api/v1/chat/send', data)
    return response.data
  },

  updateConversationTitle: async (conversationId: number, title: string): Promise<void> => {
    await api.patch(`/api/v1/chat/conversations/${conversationId}`, { title })
  },

  deleteConversation: async (conversationId: number): Promise<void> => {
    await api.delete(`/api/v1/chat/conversations/${conversationId}`)
  },
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Get all conversations
 */
export function useConversations() {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: chatApiClient.getConversations,
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Get messages for a conversation
 */
export function useConversationMessages(conversationId: number | null) {
  return useQuery({
    queryKey: chatKeys.messages(conversationId!),
    queryFn: () => chatApiClient.getMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
  })
}

/**
 * Send message mutation
 * Handles both new conversations and existing ones
 */
export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SendMessageRequest) => chatApiClient.sendMessage(data),
    onSuccess: (response) => {
      // Invalidate conversations to update list
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })

      // Invalidate messages if this was an existing conversation
      if (response.conversation_id) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.messages(response.conversation_id),
        })
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || '메시지 전송에 실패했습니다'
      message.error(errorMessage)
    },
  })
}

/**
 * Update conversation title mutation
 */
export function useUpdateConversationTitle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, title }: { conversationId: number; title: string }) =>
      chatApiClient.updateConversationTitle(conversationId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
      message.success('제목이 변경되었습니다')
    },
    onError: () => {
      message.error('제목 변경에 실패했습니다')
    },
  })
}

/**
 * Delete conversation mutation
 */
export function useDeleteConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: chatApiClient.deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
      message.success('대화가 삭제되었습니다')
    },
    onError: () => {
      message.error('대화 삭제에 실패했습니다')
    },
  })
}

// ============================================================================
// Custom Hook for Chat State Management
// ============================================================================

export interface UseChatOptions {
  initialConversationId?: number | null
}

/**
 * Combined hook for chat functionality
 * Provides all necessary state and actions for the chat UI
 */
export function useChat(options: UseChatOptions = {}) {
  const {
    data: conversations = [],
    isLoading: isLoadingConversations,
    refetch: refetchConversations,
  } = useConversations()

  const sendMessageMutation = useSendMessage()
  const deleteConversationMutation = useDeleteConversation()

  return {
    // Data
    conversations,

    // Loading states
    isLoadingConversations,
    isSending: sendMessageMutation.isPending,

    // Actions
    sendMessage: sendMessageMutation.mutateAsync,
    deleteConversation: deleteConversationMutation.mutateAsync,
    refetchConversations,

    // Mutation states for advanced usage
    sendMessageMutation,
    deleteConversationMutation,
  }
}
