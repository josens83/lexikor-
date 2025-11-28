/**
 * TypingIndicator Component
 * Animated dots showing AI is typing
 *
 * @module components/chat/TypingIndicator
 * @lines < 50
 */

import { Space, Avatar } from 'antd'
import { RobotOutlined } from '@ant-design/icons'

export interface TypingIndicatorProps {
  visible?: boolean
}

const dotStyle = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: '#1890ff',
  display: 'inline-block',
  animation: 'typingBounce 1.4s infinite ease-in-out both',
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ visible = true }) => {
  if (!visible) return null

  return (
    <div style={{ display: 'flex', marginBottom: 16 }}>
      <Space align="start" size="middle">
        <Avatar
          icon={<RobotOutlined />}
          style={{ background: '#52c41a', flexShrink: 0 }}
        />
        <div
          style={{
            background: '#f6f6f6',
            padding: '16px 20px',
            borderRadius: 12,
            borderLeft: '3px solid #52c41a',
          }}
        >
          <Space size={4}>
            <span style={{ ...dotStyle, animationDelay: '0s' }} />
            <span style={{ ...dotStyle, animationDelay: '0.16s' }} />
            <span style={{ ...dotStyle, animationDelay: '0.32s' }} />
          </Space>
          <style>{`
            @keyframes typingBounce {
              0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
              40% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      </Space>
    </div>
  )
}

export default TypingIndicator
