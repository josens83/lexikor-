/**
 * Chat Page
 * Main container for the AI legal assistant chat interface
 * Features: Search, Feedback, Mobile responsive, Keyboard shortcuts, Dark mode, File attachment
 *
 * @module pages/Chat
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Layout, Card, Button, Drawer, Space, Badge } from 'antd'
import { MenuOutlined, PaperClipOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChatSidebar,
  ChatHeader,
  ChatMessages,
  ChatInput,
  ConversationExport,
  ThemeToggle,
  FileAttachment,
  StreamingMessage,
  ScrollToBottom,
  type AttachedFile,
} from '@/components/chat'
import { useStreamingResponse, useKeyboardShortcuts, CHAT_SHORTCUTS } from '@/hooks'
import {
  useConversations,
  useConversationMessages,
  useSendMessage,
  useDeleteConversation,
  useUpdateConversationTitle,
} from '@/hooks/queries/useChat'
import { api } from '@/services/api.refactored'
import type { LegalArea, SendMessageRequest } from '@/types/chat'
import type { Message } from '@/types'
import { MessageRole } from '@/types'

const { Sider, Content } = Layout

// Breakpoint for mobile
const MOBILE_BREAKPOINT = 768

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
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [showFileAttachment, setShowFileAttachment] = useState(false)
  const [useStreaming, setUseStreaming] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // React Query hooks
  const { data: conversations = [], isLoading: isLoadingConversations } = useConversations()
  const {
    data: conversationData,
    isLoading: isLoadingMessages,
    error: messagesError,
    refetch: refetchMessages,
  } = useConversationMessages(currentConversationId)
  const sendMessageMutation = useSendMessage()
  const deleteConversationMutation = useDeleteConversation()
  const updateTitleMutation = useUpdateConversationTitle()

  // Streaming response hook
  const {
    content: streamingContent,
    isStreaming,
    startStreaming,
    stopStreaming,
    reset: resetStreaming,
  } = useStreamingResponse({
    onComplete: (content, convId, msgId) => {
      // Add the completed message to local messages
      const assistantMessage: Message = {
        id: msgId,
        role: MessageRole.ASSISTANT,
        content,
        conversation_id: convId,
        created_at: new Date().toISOString(),
      }
      setLocalMessages((prev) => [...prev, assistantMessage])
      resetStreaming()

      // Update conversation ID if new
      if (!currentConversationId && convId) {
        setCurrentConversationId(convId)
        navigate(`/chat/${convId}`)
      }
    },
    onError: () => {
      resetStreaming()
    },
  })

  // Handle window resize for responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current && (localMessages.length > 0 || isStreaming)) {
      const container = messagesContainerRef.current
      container.scrollTop = container.scrollHeight
    }
  }, [localMessages, isStreaming, streamingContent])

  // Handle scroll visibility
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }
  }, [])

  // Scroll to bottom handler
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [])

  // Focus input handler
  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  // Handle new chat
  const handleNewChat = useCallback(() => {
    setCurrentConversationId(null)
    setLocalMessages([])
    setInputMessage('')
    setDrawerOpen(false)
    navigate('/chat')
  }, [navigate])

  // Handle conversation selection
  const handleSelectConversation = useCallback((id: number) => {
    setCurrentConversationId(id)
    setDrawerOpen(false)
    navigate(`/chat/${id}`)
  }, [navigate])

  // Handle suggestion click from empty state
  const handleSuggestionClick = useCallback((question: string) => {
    setInputMessage(question)
  }, [])

  // Handle message feedback
  const handleFeedback = useCallback(async (messageId: number, rating: number) => {
    await api.put(`/api/v1/chat/messages/${messageId}/feedback`, { rating })
  }, [])

  // Handle send message
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || sendMessageMutation.isPending || isStreaming) return

    const userMessage = inputMessage.trim()
    const filesToSend = [...attachedFiles]

    // Clear input and files
    setInputMessage('')
    setAttachedFiles([])
    setShowFileAttachment(false)

    // Build message with file info
    const messageWithFiles = filesToSend.length > 0
      ? `${userMessage}\n\n[첨부 파일: ${filesToSend.map(f => f.name).join(', ')}]`
      : userMessage

    // Optimistic update - add user message
    const tempUserMessage: Message = {
      id: Date.now(),
      role: MessageRole.USER,
      content: messageWithFiles,
      conversation_id: currentConversationId || 0,
      created_at: new Date().toISOString(),
    }
    setLocalMessages((prev) => [...prev, tempUserMessage])

    // Use streaming if enabled
    if (useStreaming) {
      startStreaming(userMessage, currentConversationId, legalArea)
      return
    }

    // Non-streaming mode
    try {
      const request: SendMessageRequest = {
        message: userMessage,
        conversation_id: currentConversationId,
        legal_area: legalArea,
        stream: false,
      }

      const response = await sendMessageMutation.mutateAsync(request)

      if (!currentConversationId && response.conversation_id) {
        setCurrentConversationId(response.conversation_id)
        navigate(`/chat/${response.conversation_id}`)
      }

      const assistantMessage: Message = {
        id: response.message_id,
        role: MessageRole.ASSISTANT,
        content: response.content,
        citations: response.citations,
        conversation_id: response.conversation_id,
        created_at: response.created_at,
      }

      setLocalMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempUserMessage.id)
        return [...filtered, { ...tempUserMessage, id: response.message_id - 1 }, assistantMessage]
      })
    } catch {
      setLocalMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id))
      // Restore files on error
      setAttachedFiles(filesToSend)
    }
  }, [inputMessage, attachedFiles, currentConversationId, legalArea, sendMessageMutation, navigate, useStreaming, isStreaming, startStreaming])

  // Handle delete conversation
  const handleDeleteConversation = useCallback(async (id: number) => {
    await deleteConversationMutation.mutateAsync(id)
    if (currentConversationId === id) {
      handleNewChat()
    }
  }, [deleteConversationMutation, currentConversationId, handleNewChat])

  // Handle title change
  const handleTitleChange = useCallback(async (convId: number, newTitle: string) => {
    await updateTitleMutation.mutateAsync({ conversationId: convId, title: newTitle })
  }, [updateTitleMutation])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    enabled: true,
    shortcuts: [
      { ...CHAT_SHORTCUTS.NEW_CHAT, handler: handleNewChat },
      { ...CHAT_SHORTCUTS.CANCEL, handler: stopStreaming },
      { key: '/', handler: focusInput },
    ],
  })

  // Sidebar content (reused in both Sider and Drawer)
  const sidebarContent = (
    <ChatSidebar
      conversations={conversations}
      currentConversationId={currentConversationId}
      legalArea={legalArea}
      isLoading={isLoadingConversations}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSelectConversation={handleSelectConversation}
      onNewChat={handleNewChat}
      onDeleteConversation={handleDeleteConversation}
      onLegalAreaChange={setLegalArea}
    />
  )

  return (
    <Layout style={{ minHeight: 'calc(100vh - 64px)', background: '#f0f2f5' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider width={300} style={{ background: '#fff', padding: '16px' }}>
          {sidebarContent}
        </Sider>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          title="대화 목록"
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={300}
        >
          {sidebarContent}
        </Drawer>
      )}

      <Content style={{ padding: isMobile ? '12px' : '24px' }}>
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isMobile && (
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setDrawerOpen(true)}
                  aria-label="메뉴 열기"
                />
              )}
              <ChatHeader
                title={conversationData?.title || '법률 AI 어시스턴트'}
                legalArea={legalArea}
                conversationId={currentConversationId}
                onTitleChange={handleTitleChange}
              />
            </div>
          }
          extra={
            <Space>
              <ThemeToggle />
              <ConversationExport
                messages={localMessages}
                conversationTitle={conversationData?.title || '대화 내역'}
                disabled={sendMessageMutation.isPending}
              />
            </Space>
          }
          style={{ height: 'calc(100vh - 112px)' }}
          styles={{ body: { height: 'calc(100% - 72px)', display: 'flex', flexDirection: 'column' }}}
        >
          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            style={{ flex: 1, overflowY: 'auto', padding: '16px 0', marginBottom: '16px', position: 'relative' }}
          >
            <ChatMessages
              messages={localMessages}
              isLoading={isLoadingMessages}
              isSending={sendMessageMutation.isPending && !useStreaming}
              error={messagesError as Error | null}
              onFeedback={handleFeedback}
              onSuggestionClick={handleSuggestionClick}
              onRetry={() => refetchMessages()}
            />
            {/* Streaming message display */}
            {isStreaming && (
              <StreamingMessage
                content={streamingContent}
                isStreaming={isStreaming}
                onStop={stopStreaming}
              />
            )}
            {/* Scroll to bottom button */}
            <ScrollToBottom
              visible={showScrollButton}
              onClick={scrollToBottom}
            />
          </div>

          {/* File Attachment Area */}
          {showFileAttachment && (
            <div style={{ marginBottom: 8 }}>
              <FileAttachment
                files={attachedFiles}
                onFilesChange={setAttachedFiles}
                disabled={sendMessageMutation.isPending}
              />
            </div>
          )}

          {/* Input Area */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <Badge count={attachedFiles.length} size="small">
              <Button
                type={showFileAttachment ? 'primary' : 'text'}
                icon={<PaperClipOutlined />}
                onClick={() => setShowFileAttachment(!showFileAttachment)}
                aria-label={`파일 첨부 (${attachedFiles.length}개 선택됨)`}
              />
            </Badge>
            <div style={{ flex: 1 }}>
              <ChatInput
                value={inputMessage}
                isSending={sendMessageMutation.isPending || isStreaming}
                disabled={isStreaming}
                onChange={setInputMessage}
                onSend={handleSendMessage}
              />
            </div>
          </div>
        </Card>
      </Content>
    </Layout>
  )
}

export default ChatPage
