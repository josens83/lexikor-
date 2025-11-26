/**
 * ChatMessages Component
 * Message list with auto-scroll, loading states, and empty state
 *
 * @module components/chat/ChatMessages
 * @lines < 90
 */

import { useRef, useEffect } from 'react'
import { Spin, Typography } from 'antd'
import MessageBubble from './MessageBubble'
import ChatEmptyState from './ChatEmptyState'
import type { ChatMessagesProps } from '@/types/chat'

const { Text } = Typography

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  isSending,
  onFeedback,
  onSuggestionClick,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  // Loading state
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    )
  }

  // Empty state with suggestions
  if (messages.length === 0) {
    return <ChatEmptyState onSuggestionClick={onSuggestionClick} />
  }

  return (
    <>
      {messages.map((msg, index) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isLast={index === messages.length - 1}
          onFeedback={onFeedback}
        />
      ))}

      {/* Sending indicator */}
      {isSending && (
        <div style={{ textAlign: 'center', padding: '16px' }}>
          <Spin size="small" />
          <Text type="secondary" style={{ marginLeft: 8 }}>
            AI가 답변을 생성하고 있습니다...
          </Text>
        </div>
      )}

      <div ref={messagesEndRef} />
    </>
  )
}

export default ChatMessages
