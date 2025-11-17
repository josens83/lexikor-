/**
 * Notification Center Component
 *
 * In-app notification system similar to GitHub, LinkedIn, Slack
 * Shows system notifications, alerts, and important updates
 */

import { useState, useEffect } from 'react'
import { Dropdown, Badge, List, Typography, Button, Empty, Tabs, Tag } from 'antd'
import {
  BellOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CrownOutlined,
  FileTextOutlined,
  MessageOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'

dayjs.extend(relativeTime)
dayjs.locale('ko')

const { Text, Paragraph } = Typography

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'success' | 'upgrade' | 'document' | 'message'
  title: string
  message: string
  read: boolean
  created_at: string
  action_url?: string
  action_label?: string
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    // TODO: Fetch from API
    // For now, using mock data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'info',
        title: 'LexiKor에 오신 것을 환영합니다',
        message: '첫 AI 채팅을 시작해보세요. 법률 질문을 자유롭게 물어보실 수 있습니다.',
        read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        action_url: '/chat',
        action_label: '채팅 시작',
      },
      {
        id: '2',
        type: 'warning',
        title: '사용량 70% 도달',
        message: '이번 달 무료 AI 쿼리 사용량의 70%를 사용했습니다.',
        read: false,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        action_url: '/billing',
        action_label: '플랜 보기',
      },
      {
        id: '3',
        type: 'success',
        title: '이메일 인증 완료',
        message: '이메일 인증이 성공적으로 완료되었습니다. 모든 기능을 사용하실 수 있습니다.',
        read: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '4',
        type: 'document',
        title: '문서 분석 완료',
        message: '계약서_샘플.pdf 분석이 완료되었습니다.',
        read: true,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        action_url: '/documents',
        action_label: '결과 보기',
      },
    ]

    setNotifications(mockNotifications)
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    // TODO: Update on server
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    // TODO: Update on server
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    // TODO: Delete on server
  }

  const getIcon = (type: Notification['type']) => {
    const icons = {
      info: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
      warning: <WarningOutlined style={{ color: '#faad14' }} />,
      success: <CheckOutlined style={{ color: '#52c41a' }} />,
      upgrade: <CrownOutlined style={{ color: '#eb2f96' }} />,
      document: <FileTextOutlined style={{ color: '#722ed1' }} />,
      message: <MessageOutlined style={{ color: '#13c2c2' }} />,
    }
    return icons[type]
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !n.read
    return true
  })

  const notificationList = (
    <div style={{ width: 400, maxHeight: 500, overflow: 'auto' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text strong style={{ fontSize: 16 }}>
          알림
        </Text>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={handleMarkAllAsRead}>
            모두 읽음 표시
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="small"
        style={{ padding: '0 20px' }}
        items={[
          {
            key: 'all',
            label: `전체 (${notifications.length})`,
          },
          {
            key: 'unread',
            label: `안 읽음 (${unreadCount})`,
          },
        ]}
      />

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <Empty
          description="새 알림이 없습니다"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: '40px 20px' }}
        />
      ) : (
        <List
          dataSource={filteredNotifications}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '16px 20px',
                background: item.read ? '#ffffff' : '#f0f9ff',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = item.read ? '#fafafa' : '#e6f7ff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = item.read ? '#ffffff' : '#f0f9ff'
              }}
              onClick={() => {
                handleMarkAsRead(item.id)
                if (item.action_url) {
                  window.location.href = item.action_url
                }
              }}
            >
              <List.Item.Meta
                avatar={getIcon(item.type)}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong={!item.read}>{item.title}</Text>
                    <Button
                      type="text"
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(item.id)
                      }}
                      style={{ marginLeft: 8 }}
                    />
                  </div>
                }
                description={
                  <div>
                    <Paragraph
                      style={{
                        margin: '4px 0 8px 0',
                        color: '#595959',
                        fontSize: 13,
                      }}
                    >
                      {item.message}
                    </Paragraph>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(item.created_at).fromNow()}
                      </Text>
                      {item.action_label && (
                        <Button type="link" size="small" style={{ padding: 0 }}>
                          {item.action_label} →
                        </Button>
                      )}
                    </div>
                    {!item.read && (
                      <Tag
                        color="blue"
                        style={{ marginTop: 8, fontSize: 11, padding: '0 6px' }}
                      >
                        NEW
                      </Tag>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  )

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      dropdownRender={() => notificationList}
      trigger={['click']}
      placement="bottomRight"
    >
      <Badge count={unreadCount} size="small">
        <BellOutlined
          style={{
            fontSize: '20px',
            cursor: 'pointer',
            color: unreadCount > 0 ? '#1890ff' : '#595959',
          }}
        />
      </Badge>
    </Dropdown>
  )
}

export default NotificationCenter
