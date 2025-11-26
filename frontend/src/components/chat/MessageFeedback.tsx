/**
 * MessageFeedback Component
 * Like/Dislike feedback for AI responses
 *
 * @module components/chat/MessageFeedback
 * @lines < 80
 */

import { useState } from 'react'
import { Space, Button, Tooltip, message } from 'antd'
import {
  LikeOutlined,
  LikeFilled,
  DislikeOutlined,
  DislikeFilled,
  CopyOutlined,
  CheckOutlined,
} from '@ant-design/icons'

export interface MessageFeedbackProps {
  messageId: number
  initialRating?: number
  content: string
  onFeedback?: (messageId: number, rating: number) => Promise<void>
}

const MessageFeedback: React.FC<MessageFeedbackProps> = ({
  messageId,
  initialRating,
  content,
  onFeedback,
}) => {
  const [rating, setRating] = useState<number | undefined>(initialRating)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFeedback = async (newRating: number) => {
    if (loading) return

    setLoading(true)
    try {
      await onFeedback?.(messageId, newRating)
      setRating(newRating)
      message.success(newRating > 0 ? '감사합니다!' : '피드백이 전달되었습니다')
    } catch {
      message.error('피드백 전송에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      message.success('복사되었습니다')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      message.error('복사에 실패했습니다')
    }
  }

  return (
    <Space size="small" style={{ marginTop: 8 }}>
      <Tooltip title="복사">
        <Button
          type="text"
          size="small"
          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
          onClick={handleCopy}
          aria-label="메시지 복사"
        />
      </Tooltip>
      <Tooltip title="도움이 되었어요">
        <Button
          type="text"
          size="small"
          icon={rating === 1 ? <LikeFilled style={{ color: '#52c41a' }} /> : <LikeOutlined />}
          onClick={() => handleFeedback(1)}
          loading={loading}
          aria-label="좋아요"
        />
      </Tooltip>
      <Tooltip title="개선이 필요해요">
        <Button
          type="text"
          size="small"
          icon={rating === -1 ? <DislikeFilled style={{ color: '#ff4d4f' }} /> : <DislikeOutlined />}
          onClick={() => handleFeedback(-1)}
          loading={loading}
          aria-label="싫어요"
        />
      </Tooltip>
    </Space>
  )
}

export default MessageFeedback
