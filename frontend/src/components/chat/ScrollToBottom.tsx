/**
 * ScrollToBottom Component
 * Floating button to scroll to the bottom of messages
 *
 * @module components/chat/ScrollToBottom
 * @lines < 50
 */

import { Button, Badge } from 'antd'
import { DownOutlined } from '@ant-design/icons'

export interface ScrollToBottomProps {
  visible: boolean
  newMessageCount?: number
  onClick: () => void
}

const ScrollToBottom: React.FC<ScrollToBottomProps> = ({
  visible,
  newMessageCount = 0,
  onClick,
}) => {
  if (!visible) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}
    >
      <Badge count={newMessageCount} size="small">
        <Button
          type="primary"
          shape="circle"
          icon={<DownOutlined />}
          onClick={onClick}
          style={{
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
          aria-label="맨 아래로 스크롤"
        />
      </Badge>
    </div>
  )
}

export default ScrollToBottom
