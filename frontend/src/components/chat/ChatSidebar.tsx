/**
 * ChatSidebar Component
 * Sidebar with conversation list and new chat button
 *
 * @module components/chat/ChatSidebar
 * @lines < 100
 */

import { Button, List, Typography, Space, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ConversationItem from './ConversationItem'
import LegalAreaSelector from './LegalAreaSelector'
import type { ChatSidebarProps } from '@/types/chat'

const { Title } = Typography

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  currentConversationId,
  legalArea,
  isLoading,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onLegalAreaChange,
}) => {
  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      {/* New Chat Button */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        block
        size="large"
        onClick={onNewChat}
      >
        새 대화
      </Button>

      {/* Legal Area Selector */}
      <LegalAreaSelector value={legalArea} onChange={onLegalAreaChange} />

      {/* Conversations List */}
      <div>
        <Title level={5}>최근 대화</Title>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="small" />
          </div>
        ) : (
          <List
            dataSource={conversations}
            locale={{ emptyText: '대화가 없습니다' }}
            renderItem={(conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={currentConversationId === conv.id}
                onClick={() => onSelectConversation(conv.id)}
                onDelete={() => onDeleteConversation(conv.id)}
              />
            )}
          />
        )}
      </div>
    </Space>
  )
}

export default ChatSidebar
