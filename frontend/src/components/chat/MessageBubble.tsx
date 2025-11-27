/**
 * MessageBubble Component
 * Individual chat message with markdown support, citations, and feedback
 *
 * @module components/chat/MessageBubble
 * @lines < 100
 */

import { Space, Avatar, Typography } from 'antd'
import { RobotOutlined, UserOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import MessageFeedback from './MessageFeedback'
import type { MessageBubbleProps } from '@/types/chat'
import { MessageRole } from '@/types'

const { Text } = Typography

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isLast,
  onFeedback,
}) => {
  const isUser = message.role === MessageRole.USER
  const isAssistant = message.role === MessageRole.ASSISTANT

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
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
              borderRadius: '12px',
              borderLeft: `3px solid ${isUser ? '#1890ff' : '#52c41a'}`,
            }}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>

            {/* Citations */}
            {message.citations && message.citations.length > 0 && (
              <div
                style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #d9d9d9',
                }}
              >
                <Text type="secondary" strong>
                  출처:
                </Text>
                {message.citations.map((citation, idx) => (
                  <div key={idx} style={{ marginTop: '4px' }}>
                    <Text type="secondary">
                      • {citation.reference || citation.title}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback for AI messages */}
          {isAssistant && (
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
