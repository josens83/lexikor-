/**
 * ChatInput Component
 * Message input with send button
 *
 * @module components/chat/ChatInput
 * @lines < 70
 */

import { Input, Button, Space } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import type { ChatInputProps } from '@/types/chat'

const { TextArea } = Input

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  isSending,
  disabled,
  onChange,
  onSend,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isSending) {
        onSend()
      }
    }
  }

  return (
    <Space.Compact style={{ width: '100%' }}>
      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="법률 질문을 입력하세요... (Shift+Enter로 줄바꿈)"
        autoSize={{ minRows: 1, maxRows: 4 }}
        style={{ flex: 1 }}
        disabled={isSending || disabled}
        aria-label="메시지 입력"
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={onSend}
        loading={isSending}
        disabled={!value.trim() || disabled}
        style={{ height: 'auto' }}
        aria-label="메시지 전송"
      >
        전송
      </Button>
    </Space.Compact>
  )
}

export default ChatInput
