/**
 * Plan Comparison Cards Component
 */

import { Card, Row, Col, List, Button, Space } from 'antd'
import { Typography } from 'antd'
import {
  CheckCircleOutlined,
  StarOutlined,
  TrophyOutlined,
  RocketOutlined,
} from '@ant-design/icons'
import { useSubscription } from '@hooks/queries'
import { Modal, message } from 'antd'
import { billingAPI } from '@services/api'
import { useState } from 'react'

const { Title, Text } = Typography

interface Plan {
  key: string
  name: string
  price: number | null
  period: string
  description: string
  icon: React.ReactNode
  popular?: boolean
  features: string[]
  buttonText: string
  disabled: boolean
}

const plans: Plan[] = [
  {
    key: 'FREE',
    name: '무료',
    price: 0,
    period: '월',
    description: '개인 사용자를 위한 기본 플랜',
    icon: <StarOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
    features: ['월 10회 AI 질의', '문서 분석 3개', '기본 법률 검색', '커뮤니티 지원'],
    buttonText: '현재 플랜',
    disabled: true,
  },
  {
    key: 'PROFESSIONAL',
    name: '프로페셔널',
    price: 99000,
    period: '월',
    description: '전문가를 위한 고급 플랜',
    icon: <TrophyOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
    popular: true,
    features: [
      '무제한 AI 질의',
      '문서 분석 100개',
      '고급 법률 검색',
      '문서 템플릿 생성',
      '우선 지원',
      'API 접근',
    ],
    buttonText: '업그레이드',
    disabled: false,
  },
  {
    key: 'ENTERPRISE',
    name: '엔터프라이즈',
    price: null,
    period: '문의',
    description: '기업을 위한 맞춤형 솔루션',
    icon: <RocketOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
    features: [
      '무제한 AI 질의',
      '무제한 문서 분석',
      '전용 법률 데이터베이스',
      '맞춤형 AI 모델',
      '전담 지원팀',
      'SLA 보장',
      'SSO 통합',
      '온프레미스 배포 옵션',
    ],
    buttonText: '문의하기',
    disabled: false,
  },
]

export function PlanCards() {
  const { data: subscription } = useSubscription()
  const [upgrading, setUpgrading] = useState(false)

  const handleUpgrade = (plan: string, planName: string) => {
    Modal.confirm({
      title: `${planName} 플랜으로 업그레이드`,
      content: `${planName} 플랜으로 업그레이드하시겠습니까?`,
      okText: '업그레이드',
      cancelText: '취소',
      onOk: async () => {
        setUpgrading(true)
        try {
          const response = await billingAPI.createCheckout(plan)
          // Redirect to Stripe checkout
          window.location.href = response.data.checkout_url
        } catch (error: any) {
          message.error(error.response?.data?.detail || '결제 페이지 생성에 실패했습니다')
          setUpgrading(false)
        }
      },
    })
  }

  return (
    <>
      <Col span={24}>
        <Title level={3}>요금제 선택</Title>
      </Col>
      {plans.map((plan) => (
        <Col xs={24} md={8} key={plan.key}>
          <Card
            style={{
              height: '100%',
              border: plan.popular ? '2px solid #1890ff' : undefined,
              position: 'relative',
            }}
          >
            {plan.popular && (
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '20px',
                  background: '#1890ff',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                인기
              </div>
            )}

            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div style={{ textAlign: 'center' }}>
                {plan.icon}
                <Title level={3} style={{ marginTop: '16px', marginBottom: '8px' }}>
                  {plan.name}
                </Title>
                <Text type="secondary">{plan.description}</Text>
              </div>

              <div style={{ textAlign: 'center' }}>
                {plan.price !== null ? (
                  <>
                    <Title level={2} style={{ margin: 0 }}>
                      {plan.price.toLocaleString()}원
                    </Title>
                    <Text type="secondary">/ {plan.period}</Text>
                  </>
                ) : (
                  <Title level={2} style={{ margin: 0 }}>
                    맞춤 견적
                  </Title>
                )}
              </div>

              <List
                dataSource={plan.features}
                renderItem={(feature) => (
                  <List.Item style={{ border: 'none', padding: '8px 0' }}>
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text>{feature}</Text>
                    </Space>
                  </List.Item>
                )}
              />

              <Button
                type={plan.popular ? 'primary' : 'default'}
                size="large"
                block
                disabled={plan.disabled || subscription?.plan === plan.key}
                loading={upgrading}
                onClick={() => handleUpgrade(plan.key, plan.name)}
              >
                {subscription?.plan === plan.key ? '현재 플랜' : plan.buttonText}
              </Button>
            </Space>
          </Card>
        </Col>
      ))}
    </>
  )
}
