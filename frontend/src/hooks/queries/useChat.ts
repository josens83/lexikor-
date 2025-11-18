/**
 * React Query Hooks for Chat & Conversations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { chatAPI } from '@services/api.refactored'
import type { ChatAPI } from '@/types'

/**
 * Query keys for chat-related queries
 */
export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  conversation: (id: number) => [...chatKeys.all, 'conversation', id] as const,
  messages: (conversationId: number) => [...chatKeys.all, 'messages', conversationId] as const,
}

/**
 * Hook to get all conversations
 */
export function useConversations() {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: async () => {
      const response = await chatAPI.getConversations()
      return response.data.conversations
    },
  })
}

/**
 * Hook to get single conversation with messages
 */
export function useConversation(conversationId: number) {
  return useQuery({
    queryKey: chatKeys.conversation(conversationId),
    queryFn: async () => {
      const response = await chatAPI.getConversation(conversationId)
      return response.data.conversation
    },
    enabled: !!conversationId,
  })
}

/**
 * Hook to create new conversation
 */
export function useCreateConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ChatAPI.CreateConversationRequest) =>
      chatAPI.createConversation(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
      return response.data.conversation
    },
  })
}

/**
 * Hook to send message in conversation
 */
export function useSendMessage(conversationId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ChatAPI.SendMessageRequest) =>
      chatAPI.sendMessage(conversationId, data),
    onSuccess: (response) => {
      // Update conversation cache with new message
      queryClient.setQueryData(
        chatKeys.conversation(conversationId),
        (oldData: any) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            messages: [...(oldData.messages || []), response.data.message],
          }
        }
      )
      // Invalidate conversations list to update last message
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
    },
  })
}

/**
 * Hook to update message feedback (like/dislike)
 */
export function useUpdateMessageFeedback() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      messageId,
      data,
    }: {
      messageId: number
      data: ChatAPI.UpdateMessageFeedbackRequest
    }) => chatAPI.updateMessageFeedback(messageId, data),
    onSuccess: (response, { messageId }) => {
      // Update all conversation caches that might contain this message
      queryClient.invalidateQueries({ queryKey: chatKeys.all })
      message.success('피드백이 저장되었습니다')
    },
  })
}

/**
 * Hook to delete conversation
 */
export function useDeleteConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (conversationId: number) =>
      chatAPI.deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
      message.success('대화가 삭제되었습니다')
    },
  })
}
