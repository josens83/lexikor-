/**
 * Chat Page
 * Main container for the AI legal assistant chat interface
 *
 * @module pages/Chat
 * @lines < 150 (container orchestration)
 */

import { useState, useEffect, useCallback } from 'react'
import { Layout, Card } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChatSidebar,
  ChatHeader,
  ChatMessages,
  ChatInput,
} from '@/components/chat'
import {
  useConversations,
  useConversationMessages,
  useSendMessage,
  useDeleteConversation,
} from '@/hooks/queries/useChat'
import type { LegalArea, SendMessageRequest } from '@/types/chat'
import type { Message } from '@/types'
import { MessageRole } from '@/types'

const { Sider, Content } = Layout

const ChatPage: React.FC = () => {
  const navigate = useNavigate()
  const { conversationId } = useParams<{ conversationId: string }>()

  // Local state
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(
    conversationId ? parseInt(conversationId) : null
  )
  const [inputMessage, setInputMessage] = useState('')
  const [legalArea, setLegalArea] = useState<LegalArea | null>(null)
  const [localMessages, setLocalMessages] = useState<Message[]>([])

  // React Query hooks
  const { data: conversations = [], isLoading: isLoadingConversations } = useConversations()
  const { data: conversationData, isLoading: isLoadingMessages } = useConversationMessages(currentConversationId)
  const sendMessageMutation = useSendMessage()
  const deleteConversationMutation = useDeleteConversation()

  // Sync URL param with state
  useEffect(() => {
    if (conversationId) {
      setCurrentConversationId(parseInt(conversationId))
    }
  }, [conversationId])

  // Sync messages from query
  useEffect(() => {
    if (conversationData?.messages) {
      setLocalMessages(conversationData.messages)
    }
  }, [conversationData])

  // Handle new chat
  const handleNewChat = useCallback(() => {
    setCurrentConversationId(null)
    setLocalMessages([])
    setInputMessage('')
    navigate('/chat')
  }, [navigate])

  // Handle conversation selection
  const handleSelectConversation = useCallback((id: number) => {
    setCurrentConversationId(id)
    navigate(`/chat/${id}`)
  }, [navigate])

  // Handle send message
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || sendMessageMutation.isPending) return

    const userMessage = inputMessage.trim()
    setInputMessage('')

    // Optimistic update - add user message immediately
    const tempUserMessage: Message = {
      id: Date.now(),
      role: MessageRole.USER,
      content: userMessage,
      conversation_id: currentConversationId || 0,
      created_at: new Date().toISOString(),
    }
    setLocalMessages((prev) => [...prev, tempUserMessage])

    try {
      const request: SendMessageRequest = {
        message: userMessage,
        conversation_id: currentConversationId,
        legal_area: legalArea,
        stream: false,
      }

      const response = await sendMessageMutation.mutateAsync(request)

      // Update conversation ID if new conversation was created
      if (!currentConversationId && response.conversation_id) {
        setCurrentConversationId(response.conversation_id)
        navigate(`/chat/${response.conversation_id}`)
      }

      // Add AI response
      const assistantMessage: Message = {
        id: response.message_id,
        role: MessageRole.ASSISTANT,
        content: response.content,
        citations: response.citations,
        conversation_id: response.conversation_id,
        created_at: response.created_at,
      }

      setLocalMessages((prev) => {
        // Replace temp user message with actual, then add assistant message
        const filtered = prev.filter((m) => m.id !== tempUserMessage.id)
        return [...filtered, { ...tempUserMessage, id: response.message_id - 1 }, assistantMessage]
      })
    } catch {
      // Remove optimistic message on error
      setLocalMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id))
    }
  }, [inputMessage, currentConversationId, legalArea, sendMessageMutation, navigate])

  // Handle delete conversation
  const handleDeleteConversation = useCallback(async (id: number) => {
    await deleteConversationMutation.mutateAsync(id)
    if (currentConversationId === id) {
      handleNewChat()
    }
  }, [deleteConversationMutation, currentConversationId, handleNewChat])

  return (
    <Layout style={{ minHeight: 'calc(100vh - 64px)', background: '#f0f2f5' }}>
      <Sider width={300} style={{ background: '#fff', padding: '16px' }}>
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          legalArea={legalArea}
          isLoading={isLoadingConversations}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onDeleteConversation={handleDeleteConversation}
          onLegalAreaChange={setLegalArea}
        />
      </Sider>

      <Content style={{ padding: '24px' }}>
        <Card
          title={<ChatHeader title="법률 AI 어시스턴트" legalArea={legalArea} />}
          style={{ height: 'calc(100vh - 112px)' }}
          styles={{ body: { height: 'calc(100% - 72px)', display: 'flex', flexDirection: 'column' }}}
        >
          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', marginBottom: '16px' }}>
            <ChatMessages
              messages={localMessages}
              isLoading={isLoadingMessages}
              isSending={sendMessageMutation.isPending}
            />
          </div>

          {/* Input Area */}
          <ChatInput
            value={inputMessage}
            isSending={sendMessageMutation.isPending}
            disabled={false}
            onChange={setInputMessage}
            onSend={handleSendMessage}
          />
        </Card>
      </Content>
    </Layout>
  )
}

export default ChatPage
