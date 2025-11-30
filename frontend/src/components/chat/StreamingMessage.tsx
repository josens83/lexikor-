/**
 * StreamingMessage Component
 * Display streaming AI response with typing animation
 *
 * @module components/chat/StreamingMessage
 * @lines < 70
 */

import { Space, Avatar, Button } from 'antd'
import { RobotOutlined, StopOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'

export interface StreamingMessageProps {
  content: string
  isStreaming: boolean
  onStop?: () => void
}

const StreamingMessage: React.FC<StreamingMessageProps> = ({
  content,
  isStreaming,
  onStop,
}) => {
  if (!content && !isStreaming) return null

  return (
    <div style={{ display: 'flex', marginBottom: 16 }}>
      <Space align="start" size="middle" style={{ maxWidth: '80%' }}>
        <Avatar
          icon={<RobotOutlined />}
          style={{ background: '#52c41a', flexShrink: 0 }}
        />
        <div>
          <div
            style={{
              background: '#f6f6f6',
              padding: '12px 16px',
              borderRadius: 12,
              borderLeft: '3px solid #52c41a',
              minWidth: 200,
            }}
          >
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <span style={{ color: '#999' }}>생각 중...</span>
            )}

            {/* Cursor animation */}
            {isStreaming && (
              <span
                style={{
                  display: 'inline-block',
                  width: 2,
                  height: 16,
                  background: '#1890ff',
                  marginLeft: 2,
                  animation: 'blink 1s infinite',
                }}
              />
            )}
            <style>{`
              @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
              }
            `}</style>
          </div>

          {/* Stop button */}
          {isStreaming && onStop && (
            <Button
              type="text"
              size="small"
              danger
              icon={<StopOutlined />}
              onClick={onStop}
              style={{ marginTop: 4 }}
            >
              응답 중지
            </Button>
          )}
        </div>
      </Space>
    </div>
  )
}

export default StreamingMessage
