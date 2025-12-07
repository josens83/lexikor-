/**
 * ChatInput Component
 * Message input with keyboard shortcuts and send button
 *
 * @module components/chat/ChatInput
 * @lines < 80
 */

import { useRef, forwardRef, useImperativeHandle } from 'react'
import { Input, Button, Space, Tooltip } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import type { ChatInputProps } from '@/types/chat'

const { TextArea } = Input

export interface ChatInputRef {
  focus: () => void
  blur: () => void
}

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({
  value,
  isSending,
  disabled,
  onChange,
  onSend,
}, ref) => {
  const textAreaRef = useRef<any>(null)

  useImperativeHandle(ref, () => ({
    focus: () => textAreaRef.current?.focus(),
    blur: () => textAreaRef.current?.blur(),
  }))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter without shift = send
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault()
      if (value.trim() && !isSending) {
        onSend()
      }
    }
    // Ctrl+Enter = send (alternative)
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (value.trim() && !isSending) {
        onSend()
      }
    }
    // Escape = clear input
    if (e.key === 'Escape') {
      onChange('')
      textAreaRef.current?.blur()
    }
  }

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Tooltip title="Enter: 전송 | Shift+Enter: 줄바꿈 | Esc: 취소" placement="topLeft">
        <TextArea
          ref={textAreaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="법률 질문을 입력하세요..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{ flex: 1 }}
          disabled={isSending || disabled}
          aria-label="메시지 입력"
        />
      </Tooltip>
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={onSend}
        loading={isSending}
        disabled={!value.trim() || disabled}
        style={{ height: 'auto' }}
        aria-label="메시지 전송 (Enter)"
      >
        전송
      </Button>
    </Space.Compact>
  )
})

ChatInput.displayName = 'ChatInput'

export default ChatInput
