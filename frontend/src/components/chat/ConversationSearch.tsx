/**
 * ConversationSearch Component
 * Search input for filtering conversations
 *
 * @module components/chat/ConversationSearch
 * @lines < 40
 */

import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export interface ConversationSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const ConversationSearch: React.FC<ConversationSearchProps> = ({
  value,
  onChange,
  placeholder = '대화 검색...',
}) => {
  return (
    <Input
      prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      allowClear
      style={{ marginBottom: 12 }}
      aria-label="대화 검색"
    />
  )
}

export default ConversationSearch
