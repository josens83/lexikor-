/**
 * ChatHeader Component
 * Chat header with title and back button
 *
 * @module components/chat/ChatHeader
 * @lines < 60
 */

import { Space, Typography, Tag } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import type { ChatHeaderProps } from '@/types/chat'
import { LEGAL_AREA_LABELS, LegalArea } from '@/types/chat'

const { Title } = Typography

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, legalArea }) => {
  const legalAreaLabel = legalArea ? LEGAL_AREA_LABELS[legalArea] : null

  return (
    <Space>
      <RobotOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
      <Title level={3} style={{ margin: 0 }}>
        {title || '법률 AI 어시스턴트'}
      </Title>
      {legalAreaLabel && (
        <Tag color="blue" style={{ marginLeft: 8 }}>
          {legalAreaLabel}
        </Tag>
      )}
    </Space>
  )
}

export default ChatHeader
