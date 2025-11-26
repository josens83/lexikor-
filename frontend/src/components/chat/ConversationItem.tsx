/**
 * ConversationItem Component
 * Individual conversation list item with delete action
 *
 * @module components/chat/ConversationItem
 * @lines < 70
 */

import { List, Typography } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import type { ConversationItemProps } from '@/types/chat'
import { LEGAL_AREA_LABELS, LegalArea } from '@/types/chat'

const { Text } = Typography

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
  onDelete,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  const legalAreaLabel = conversation.legal_area
    ? LEGAL_AREA_LABELS[conversation.legal_area as LegalArea] || conversation.legal_area
    : undefined

  return (
    <List.Item
      style={{
        cursor: 'pointer',
        background: isActive ? '#e6f7ff' : 'transparent',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '8px',
        transition: 'background 0.2s ease',
      }}
      onClick={onClick}
      actions={[
        <DeleteOutlined
          key="delete"
          onClick={handleDelete}
          style={{ color: '#ff4d4f' }}
          aria-label="대화 삭제"
        />,
      ]}
    >
      <List.Item.Meta
        title={
          <Text ellipsis style={{ maxWidth: 180 }}>
            {conversation.title}
          </Text>
        }
        description={legalAreaLabel}
      />
    </List.Item>
  )
}

export default ConversationItem
