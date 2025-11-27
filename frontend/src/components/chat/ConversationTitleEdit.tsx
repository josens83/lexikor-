/**
 * ConversationTitleEdit Component
 * Inline editable conversation title
 *
 * @module components/chat/ConversationTitleEdit
 * @lines < 70
 */

import { useState, useRef, useEffect } from 'react'
import { Input, Typography } from 'antd'
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

const { Text } = Typography

export interface ConversationTitleEditProps {
  title: string
  onSave: (newTitle: string) => Promise<void>
  maxWidth?: number
}

const ConversationTitleEdit: React.FC<ConversationTitleEditProps> = ({
  title,
  onSave,
  maxWidth = 180,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(title)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<any>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = async () => {
    if (!editValue.trim() || editValue === title) {
      setIsEditing(false)
      setEditValue(title)
      return
    }

    setSaving(true)
    try {
      await onSave(editValue.trim())
      setIsEditing(false)
    } catch {
      setEditValue(title)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(title)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onPressEnter={handleSave}
        onBlur={handleSave}
        onKeyDown={(e) => e.key === 'Escape' && handleCancel()}
        size="small"
        style={{ width: maxWidth }}
        disabled={saving}
        suffix={saving ? null : <CheckOutlined onClick={handleSave} />}
      />
    )
  }

  return (
    <Text
      ellipsis
      style={{ maxWidth, cursor: 'pointer' }}
      onClick={() => setIsEditing(true)}
    >
      {title} <EditOutlined style={{ fontSize: 12, opacity: 0.5 }} />
    </Text>
  )
}

export default ConversationTitleEdit
