/**
 * MessageRetry Component
 * Retry button for failed messages
 *
 * @module components/chat/MessageRetry
 * @lines < 45
 */

import { Button, Space, Typography } from 'antd'
import { ReloadOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

export interface MessageRetryProps {
  onRetry: () => void
  onDelete: () => void
  isRetrying?: boolean
}

const MessageRetry: React.FC<MessageRetryProps> = ({
  onRetry,
  onDelete,
  isRetrying = false,
}) => {
  return (
    <div style={{ marginTop: 8 }}>
      <Space>
        <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
        <Text type="danger" style={{ fontSize: 12 }}>
          전송 실패
        </Text>
        <Button
          type="link"
          size="small"
          icon={<ReloadOutlined spin={isRetrying} />}
          onClick={onRetry}
          disabled={isRetrying}
          style={{ padding: 0 }}
        >
          다시 시도
        </Button>
        <Button
          type="link"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={onDelete}
          style={{ padding: 0 }}
        >
          삭제
        </Button>
      </Space>
    </div>
  )
}

export default MessageRetry
