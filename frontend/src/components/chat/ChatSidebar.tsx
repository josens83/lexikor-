/**
 * ChatSidebar Component
 * Sidebar with conversation list, search, and new chat button
 *
 * @module components/chat/ChatSidebar
 * @lines < 100
 */

import { useMemo } from 'react'
import { Button, List, Typography, Space, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ConversationItem from './ConversationItem'
import LegalAreaSelector from './LegalAreaSelector'
import ConversationSearch from './ConversationSearch'
import type { ChatSidebarProps } from '@/types/chat'

const { Title } = Typography

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  currentConversationId,
  legalArea,
  isLoading,
  searchQuery = '',
  onSearchChange,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onLegalAreaChange,
}) => {
  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations
    const query = searchQuery.toLowerCase()
    return conversations.filter(
      (conv) =>
        conv.title.toLowerCase().includes(query) ||
        conv.legal_area?.toLowerCase().includes(query)
    )
  }, [conversations, searchQuery])

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

        {/* Search */}
        {onSearchChange && (
          <ConversationSearch value={searchQuery} onChange={onSearchChange} />
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="small" />
          </div>
        ) : (
          <List
            dataSource={filteredConversations}
            locale={{ emptyText: searchQuery ? '검색 결과가 없습니다' : '대화가 없습니다' }}
            style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}
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
