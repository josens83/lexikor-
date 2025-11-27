/**
 * MessagesSkeleton Component
 * Loading skeleton for chat messages
 *
 * @module components/chat/MessagesSkeleton
 * @lines < 60
 */

import { Skeleton, Space } from 'antd'

interface MessagesSkeletonProps {
  count?: number
}

const MessageItemSkeleton: React.FC<{ isUser?: boolean }> = ({ isUser = false }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 16,
    }}
  >
    <Space align="start" size="middle" style={{ maxWidth: '70%' }}>
      {!isUser && <Skeleton.Avatar active size="default" />}
      <div
        style={{
          background: isUser ? '#e6f7ff' : '#f6f6f6',
          padding: '12px 16px',
          borderRadius: 12,
          minWidth: 200,
        }}
      >
        <Skeleton
          active
          title={false}
          paragraph={{ rows: isUser ? 1 : 3, width: isUser ? 150 : ['100%', '80%', '60%'] }}
        />
      </div>
      {isUser && <Skeleton.Avatar active size="default" />}
    </Space>
  </div>
)

const MessagesSkeleton: React.FC<MessagesSkeletonProps> = ({ count = 3 }) => {
  return (
    <div style={{ padding: '16px 0' }}>
      {Array.from({ length: count }).map((_, index) => (
        <MessageItemSkeleton key={index} isUser={index % 2 === 0} />
      ))}
    </div>
  )
}

export default MessagesSkeleton
