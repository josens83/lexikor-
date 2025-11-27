/**
 * ChatErrorFallback Component
 * Error display for chat module with retry option
 *
 * @module components/chat/ChatErrorFallback
 * @lines < 50
 */

import { Result, Button, Typography } from 'antd'
import { ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons'

const { Text } = Typography

export interface ChatErrorFallbackProps {
  error?: Error | null
  message?: string
  onRetry?: () => void
}

const ChatErrorFallback: React.FC<ChatErrorFallbackProps> = ({
  error,
  message = '메시지를 불러오는 중 오류가 발생했습니다.',
  onRetry,
}) => {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <Result
        icon={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
        title="문제가 발생했습니다"
        subTitle={
          <div>
            <Text type="secondary">{message}</Text>
            {import.meta.env.DEV && error && (
              <pre style={{ marginTop: 12, fontSize: 11, color: '#999', textAlign: 'left' }}>
                {error.message}
              </pre>
            )}
          </div>
        }
        extra={
          onRetry && (
            <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
              다시 시도
            </Button>
          )
        }
      />
    </div>
  )
}

export default ChatErrorFallback
