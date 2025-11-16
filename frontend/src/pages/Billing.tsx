import { useState, useEffect } from 'react'
import { Card, Row, Col, Typography, Button, Space, Progress, Statistic, Tag, Modal, message, List, Descriptions } from 'antd'
import { CreditCardOutlined, CheckCircleOutlined, CloseCircleOutlined, TrophyOutlined, RocketOutlined, StarOutlined } from '@ant-design/icons'
import { billingAPI } from '../services/api'

const { Title, Text, Paragraph } = Typography

interface Subscription {
  id: number
  plan: string
  status: string
  query_limit: number
  queries_used: number
  document_limit: number
  documents_count: number
  price: number
  current_period_end: string | null
}

interface UsageStats {
  plan: string
  queries: {
    used: number
    limit: number
    percentage: number
  }
  documents: {
    count: number
    limit: number
    percentage: number
  }
  period: {
    start: string
    end: string
  }
}

const Billing = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    loadSubscription()
    loadUsage()
  }, [])

  const loadSubscription = async () => {
    setLoading(true)
    try {
      const response = await billingAPI.getSubscription()
      setSubscription(response.data)
    } catch (error: any) {
      if (error.response?.status !== 404) {
        message.error('구독 정보를 불러오는데 실패했습니다')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadUsage = async () => {
    try {
      const response = await billingAPI.getUsage()
      setUsage(response.data)
    } catch (error) {
      console.error('Failed to load usage:', error)
    }
  }

  const handleUpgrade = async (plan: string) => {
    Modal.confirm({
      title: `${planNames[plan]} 플랜으로 업그레이드`,
      content: `${planNames[plan]} 플랜으로 업그레이드하시겠습니까?`,
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
      }
    })
  }

  const handleCancel = () => {
    Modal.confirm({
      title: '구독 취소',
      content: '정말 구독을 취소하시겠습니까? 현재 결제 기간이 끝나면 무료 플랜으로 전환됩니다.',
      okText: '취소하기',
      okType: 'danger',
      cancelText: '닫기',
      onOk: async () => {
        try {
          await billingAPI.cancelSubscription()
          message.success('구독이 취소되었습니다')
          await loadSubscription()
        } catch (error) {
          message.error('구독 취소에 실패했습니다')
        }
      }
    })
  }

  const planNames: Record<string, string> = {
    FREE: '무료',
    PROFESSIONAL: '프로페셔널',
    ENTERPRISE: '엔터프라이즈'
  }

  const planColors: Record<string, string> = {
    FREE: 'default',
    PROFESSIONAL: 'blue',
    ENTERPRISE: 'purple'
  }

  const plans = [
    {
      key: 'FREE',
      name: '무료',
      price: 0,
      period: '월',
      description: '개인 사용자를 위한 기본 플랜',
      icon: <StarOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      features: [
        '월 10회 AI 질의',
        '문서 분석 3개',
        '기본 법률 검색',
        '커뮤니티 지원'
      ],
      buttonText: '현재 플랜',
      disabled: true
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
        'API 접근'
      ],
      buttonText: '업그레이드',
      disabled: false
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
        '온프레미스 배포 옵션'
      ],
      buttonText: '문의하기',
      disabled: false
    }
  ]

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Title level={2}>결제 및 구독</Title>
              <Paragraph type="secondary">
                요금제를 선택하고 구독을 관리하세요. 언제든지 업그레이드하거나 취소할 수 있습니다.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        {/* Current Subscription */}
        {subscription && (
          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            <Col span={24}>
              <Card
                title={
                  <Space>
                    <CreditCardOutlined style={{ color: '#1890ff' }} />
                    <Text strong>현재 구독 정보</Text>
                  </Space>
                }
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={6}>
                    <Statistic
                      title="현재 플랜"
                      value={planNames[subscription.plan] || subscription.plan}
                      prefix={
                        <Tag color={planColors[subscription.plan] || 'default'}>
                          {subscription.status}
                        </Tag>
                      }
                    />
                  </Col>
                  <Col xs={24} md={6}>
                    <Statistic
                      title="월 요금"
                      value={subscription.price}
                      suffix="원"
                    />
                  </Col>
                  <Col xs={24} md={6}>
                    <Statistic
                      title="AI 질의"
                      value={subscription.queries_used}
                      suffix={
                        subscription.query_limit === -1
                          ? '/ 무제한'
                          : `/ ${subscription.query_limit}`
                      }
                    />
                  </Col>
                  <Col xs={24} md={6}>
                    <Statistic
                      title="문서 분석"
                      value={subscription.documents_count}
                      suffix={
                        subscription.document_limit === -1
                          ? '/ 무제한'
                          : `/ ${subscription.document_limit}`
                      }
                    />
                  </Col>
                </Row>

                {usage && (
                  <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                    <Col xs={24} md={12}>
                      <div>
                        <Text type="secondary">AI 질의 사용량</Text>
                        <Progress
                          percent={Math.min(usage.queries.percentage, 100)}
                          status={usage.queries.percentage > 90 ? 'exception' : 'active'}
                          strokeColor={usage.queries.percentage > 90 ? '#ff4d4f' : '#1890ff'}
                        />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {usage.queries.used} / {usage.queries.limit === -1 ? '무제한' : usage.queries.limit} 사용
                        </Text>
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <div>
                        <Text type="secondary">문서 분석 사용량</Text>
                        <Progress
                          percent={Math.min(usage.documents.percentage, 100)}
                          status={usage.documents.percentage > 90 ? 'exception' : 'active'}
                          strokeColor={usage.documents.percentage > 90 ? '#ff4d4f' : '#52c41a'}
                        />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {usage.documents.count} / {usage.documents.limit === -1 ? '무제한' : usage.documents.limit} 사용
                        </Text>
                      </div>
                    </Col>
                  </Row>
                )}

                {subscription.current_period_end && (
                  <div style={{ marginTop: '24px' }}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="다음 결제일">
                        {new Date(subscription.current_period_end).toLocaleDateString('ko-KR')}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                )}

                {subscription.plan !== 'FREE' && subscription.status === 'ACTIVE' && (
                  <div style={{ marginTop: '24px' }}>
                    <Button danger onClick={handleCancel}>
                      구독 취소
                    </Button>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        )}

        {/* Plan Cards */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <Title level={3}>요금제 선택</Title>
          </Col>
          {plans.map((plan) => (
            <Col xs={24} md={8} key={plan.key}>
              <Card
                style={{
                  height: '100%',
                  border: plan.popular ? '2px solid #1890ff' : undefined,
                  position: 'relative'
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
                      fontWeight: 'bold'
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
                    disabled={plan.disabled || (subscription?.plan === plan.key)}
                    loading={upgrading}
                    onClick={() => handleUpgrade(plan.key)}
                  >
                    {subscription?.plan === plan.key ? '현재 플랜' : plan.buttonText}
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {/* FAQ or Additional Info */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <Card>
              <Title level={4}>자주 묻는 질문</Title>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div>
                  <Text strong>언제든지 플랜을 변경할 수 있나요?</Text>
                  <Paragraph type="secondary">
                    네, 언제든지 업그레이드하거나 다운그레이드할 수 있습니다.
                    업그레이드 시 즉시 적용되며, 다운그레이드는 현재 결제 기간이 끝난 후 적용됩니다.
                  </Paragraph>
                </div>
                <div>
                  <Text strong>환불 정책은 어떻게 되나요?</Text>
                  <Paragraph type="secondary">
                    결제 후 7일 이내에는 전액 환불이 가능합니다.
                    7일 이후에는 남은 기간에 대한 비례 환불이 제공됩니다.
                  </Paragraph>
                </div>
                <div>
                  <Text strong>엔터프라이즈 플랜은 어떻게 이용하나요?</Text>
                  <Paragraph type="secondary">
                    엔터프라이즈 플랜은 맞춤형 솔루션입니다.
                    sales@lexikor.ai로 문의하시면 담당자가 연락드립니다.
                  </Paragraph>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Billing
