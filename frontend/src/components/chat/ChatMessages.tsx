/**
 * ChatMessages Component
 * Message list with typing indicator, scroll-to-bottom, and enhanced features
 *
 * @module components/chat/ChatMessages
 * @lines < 100
 */

import { useRef, useEffect, useState, useCallback } from 'react'
import MessageBubble from './MessageBubble'
import ChatEmptyState from './ChatEmptyState'
import MessagesSkeleton from './MessagesSkeleton'
import ChatErrorFallback from './ChatErrorFallback'
import TypingIndicator from './TypingIndicator'
import ScrollToBottom from './ScrollToBottom'
import type { ChatMessagesProps } from '@/types/chat'

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  isSending,
  error,
  onFeedback,
  onSuggestionClick,
  onRetry,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages, isSending, scrollToBottom])

  // Check scroll position for showing scroll button
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShowScrollBtn(!isNearBottom && messages.length > 3)
  }, [messages.length])

  // Error state
  if (error) {
    return <ChatErrorFallback error={error} onRetry={onRetry} />
  }

  // Loading state
  if (isLoading) {
    return <MessagesSkeleton count={3} />
  }

  // Empty state
  if (messages.length === 0 && !isSending) {
    return <ChatEmptyState onSuggestionClick={onSuggestionClick} />
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ position: 'relative', height: '100%' }}
    >
      {messages.map((msg, index) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isLast={index === messages.length - 1}
          onFeedback={onFeedback}
        />
      ))}

      {/* Typing indicator */}
      <TypingIndicator visible={isSending} />

      {/* Scroll to bottom button */}
      <ScrollToBottom visible={showScrollBtn} onClick={scrollToBottom} />

      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessages
