/**
 * ChatHeader Component
 * Chat header with title and back button
 *
 * @module components/chat/ChatHeader
 * @lines < 70
 */

import { Space, Typography, Tag } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import ConversationTitleEdit from './ConversationTitleEdit'
import type { ChatHeaderProps } from '@/types/chat'
import { LEGAL_AREA_LABELS } from '@/types/chat'

const { Title } = Typography

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  legalArea,
  conversationId,
  onTitleChange,
}) => {
  const legalAreaLabel = legalArea ? LEGAL_AREA_LABELS[legalArea] : null
  const canEdit = !!conversationId && !!onTitleChange

  const handleTitleSave = async (newTitle: string) => {
    if (conversationId && onTitleChange) {
      await onTitleChange(conversationId, newTitle)
    }
  }

  return (
    <Space>
      <RobotOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
      {canEdit ? (
        <ConversationTitleEdit
          title={title || '새 대화'}
          onSave={handleTitleSave}
          maxWidth={250}
        />
      ) : (
        <Title level={3} style={{ margin: 0 }}>
          {title || '법률 AI 어시스턴트'}
        </Title>
      )}
      {legalAreaLabel && (
        <Tag color="blue" style={{ marginLeft: 8 }}>
          {legalAreaLabel}
        </Tag>
      )}
    </Space>
  )
}

export default ChatHeader
