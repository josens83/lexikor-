/**
 * MessageBubble Component
 * Individual chat message with markdown, citations, timestamps, and feedback
 *
 * @module components/chat/MessageBubble
 * @lines < 100
 */

import { Space, Avatar } from 'antd'
import { RobotOutlined, UserOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import MessageFeedback from './MessageFeedback'
import CitationCard from './CitationCard'
import MessageTimestamp from './MessageTimestamp'
import MessageRetry from './MessageRetry'
import type { MessageBubbleProps } from '@/types/chat'
import { MessageRole } from '@/types'

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isLast,
  onFeedback,
  isFailed,
  onRetry,
  onDelete,
  isRetrying,
}) => {
  const isUser = message.role === MessageRole.USER
  const isAssistant = message.role === MessageRole.ASSISTANT

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 16,
      }}
    >
      <Space align="start" size="middle" style={{ maxWidth: '80%' }}>
        {isAssistant && (
          <Avatar
            icon={<RobotOutlined />}
            style={{ background: '#52c41a', flexShrink: 0 }}
          />
        )}
        <div>
          <div
            style={{
              background: isUser ? '#e6f7ff' : '#f6f6f6',
              padding: '12px 16px',
              borderRadius: 12,
              borderLeft: `3px solid ${isUser ? '#1890ff' : '#52c41a'}`,
              opacity: isFailed ? 0.7 : 1,
            }}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>

            {/* Citations with enhanced UI */}
            {message.citations && message.citations.length > 0 && (
              <CitationCard citations={message.citations} />
            )}
          </div>

          {/* Timestamp */}
          <div style={{ marginTop: 4, textAlign: isUser ? 'right' : 'left' }}>
            <MessageTimestamp timestamp={message.created_at} />
          </div>

          {/* Failed message retry */}
          {isFailed && onRetry && onDelete && (
            <MessageRetry
              onRetry={onRetry}
              onDelete={onDelete}
              isRetrying={isRetrying}
            />
          )}

          {/* Feedback for AI messages */}
          {isAssistant && !isFailed && (
            <MessageFeedback
              messageId={message.id}
              initialRating={message.rating}
              content={message.content}
              onFeedback={onFeedback}
            />
          )}
        </div>
        {isUser && (
          <Avatar
            icon={<UserOutlined />}
            style={{ background: '#1890ff', flexShrink: 0 }}
          />
        )}
      </Space>
    </div>
  )
}

export default MessageBubble
