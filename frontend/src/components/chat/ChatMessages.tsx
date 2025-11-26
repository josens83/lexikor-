/**
 * ChatMessages Component
 * Message list with auto-scroll and loading states
 *
 * @module components/chat/ChatMessages
 * @lines < 90
 */

import { useRef, useEffect } from 'react'
import { Empty, Spin, Typography } from 'antd'
import MessageBubble from './MessageBubble'
import type { ChatMessagesProps } from '@/types/chat'

const { Text } = Typography

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  isSending,
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

  // Empty state
  if (messages.length === 0) {
    return (
      <Empty
        description="새로운 대화를 시작하세요"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ padding: '40px 0' }}
      >
        <Text type="secondary">
          법률 관련 질문을 입력하시면 AI가 관련 판례와 법령을 인용하여
          답변해드립니다.
        </Text>
      </Empty>
    )
  }

  return (
    <>
      {messages.map((msg, index) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isLast={index === messages.length - 1}
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
