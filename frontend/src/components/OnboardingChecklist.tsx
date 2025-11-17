/**
 * Onboarding Checklist Component
 *
 * Helps new users complete essential setup tasks
 * Similar to Notion, Stripe, Vercel onboarding checklists
 */

import { useState, useEffect } from 'react'
import { Card, Checkbox, Progress, Button, Space, Typography, Collapse } from 'antd'
import {
  CheckCircleOutlined,
  MailOutlined,
  MessageOutlined,
  FileTextOutlined,
  CrownOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Text, Paragraph } = Typography
const { Panel } = Collapse

interface ChecklistItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  action?: () => void
  actionLabel?: string
}

interface OnboardingChecklistProps {
  user: any
  onDismiss: () => void
}

const OnboardingChecklist = ({ user, onDismiss }: OnboardingChecklistProps) => {
  const navigate = useNavigate()
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    // Initialize checklist based on user state
    const checklistItems: ChecklistItem[] = [
      {
        id: 'verify_email',
        title: '이메일 인증 완료',
        description: '계정 보안과 모든 기능 사용을 위해 이메일을 인증해주세요',
        icon: <MailOutlined style={{ color: '#1890ff' }} />,
        completed: user?.is_verified || false,
        action: () => {
          // Resend verification email logic would go here
        },
        actionLabel: '인증 이메일 재발송',
      },
      {
        id: 'first_chat',
        title: '첫 AI 채팅 시작',
        description: 'AI 법률 어시스턴트와 대화를 시작해보세요',
        icon: <MessageOutlined style={{ color: '#52c41a' }} />,
        completed: false, // Would check from user stats
        action: () => navigate('/chat'),
        actionLabel: '채팅 시작하기',
      },
      {
        id: 'upload_document',
        title: '문서 업로드 및 분석',
        description: '계약서나 법률 문서를 업로드하여 AI 분석을 체험해보세요',
        icon: <FileTextOutlined style={{ color: '#faad14' }} />,
        completed: false, // Would check from user stats
        action: () => navigate('/documents'),
        actionLabel: '문서 업로드',
      },
      {
        id: 'explore_features',
        title: '주요 기능 둘러보기',
        description: '판례 검색, 템플릿, 리서치 기능을 확인해보세요',
        icon: <CheckCircleOutlined style={{ color: '#722ed1' }} />,
        completed: false,
        action: () => navigate('/research'),
        actionLabel: '기능 탐색',
      },
      {
        id: 'consider_upgrade',
        title: 'Professional 플랜 알아보기',
        description: '무제한 AI 쿼리와 고급 기능을 확인해보세요',
        icon: <CrownOutlined style={{ color: '#eb2f96' }} />,
        completed: false,
        action: () => navigate('/billing'),
        actionLabel: '플랜 보기',
      },
    ]

    setItems(checklistItems)
  }, [user, navigate])

  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.length
  const progress = Math.round((completedCount / totalCount) * 100)

  const handleToggle = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    )
  }

  // Don't show if all completed
  if (completedCount === totalCount) {
    return null
  }

  return (
    <Card
      style={{
        marginBottom: 24,
        borderLeft: '4px solid #1890ff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
      bodyStyle={{ padding: isExpanded ? 24 : 16 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Title level={4} style={{ margin: 0 }}>
              🎯 시작하기 체크리스트
            </Title>
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={onDismiss}
              style={{ marginLeft: 'auto' }}
            />
          </div>

          <Paragraph style={{ color: '#8c8c8c', marginBottom: 16 }}>
            LexiKor를 최대한 활용하기 위한 필수 단계들입니다
          </Paragraph>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text strong>{completedCount}/{totalCount} 완료</Text>
              <Text type="secondary">{progress}%</Text>
            </div>
            <Progress
              percent={progress}
              strokeColor={{
                '0%': '#1890ff',
                '100%': '#52c41a',
              }}
              showInfo={false}
            />
          </div>

          {isExpanded && (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: 12,
                    background: item.completed ? '#f6ffed' : '#fafafa',
                    borderRadius: 8,
                    border: `1px solid ${item.completed ? '#b7eb8f' : '#d9d9d9'}`,
                    transition: 'all 0.3s',
                  }}
                >
                  <Checkbox
                    checked={item.completed}
                    onChange={() => handleToggle(item.id)}
                    style={{ marginTop: 2 }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      {item.icon}
                      <Text
                        strong
                        style={{
                          textDecoration: item.completed ? 'line-through' : 'none',
                          color: item.completed ? '#8c8c8c' : '#262626',
                        }}
                      >
                        {item.title}
                      </Text>
                    </div>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 13,
                        display: 'block',
                        marginBottom: item.action && !item.completed ? 8 : 0,
                      }}
                    >
                      {item.description}
                    </Text>
                    {item.action && !item.completed && (
                      <Button size="small" type="link" onClick={item.action} style={{ padding: 0 }}>
                        {item.actionLabel} →
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </Space>
          )}

          {!isExpanded && (
            <Button type="link" onClick={() => setIsExpanded(true)} style={{ padding: 0 }}>
              체크리스트 보기 →
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default OnboardingChecklist
