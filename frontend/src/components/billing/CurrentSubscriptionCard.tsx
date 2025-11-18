/**
 * Current Subscription Info Card Component
 */

import { Card, Row, Col, Statistic, Tag, Progress, Descriptions, Button, Space } from 'antd'
import { Typography } from 'antd'
import { CreditCardOutlined } from '@ant-design/icons'
import { useSubscription, useUsage, useCancelSubscription } from '@hooks/queries'
import { Modal } from 'antd'

const { Text } = Typography

const planNames: Record<string, string> = {
  FREE: '무료',
  PROFESSIONAL: '프로페셔널',
  ENTERPRISE: '엔터프라이즈',
}

const planColors: Record<string, string> = {
  FREE: 'default',
  PROFESSIONAL: 'blue',
  ENTERPRISE: 'purple',
}

export function CurrentSubscriptionCard() {
  const { data: subscription, isLoading } = useSubscription()
  const { data: usage } = useUsage()
  const { mutate: cancelSubscription } = useCancelSubscription()

  const handleCancel = () => {
    Modal.confirm({
      title: '구독 취소',
      content:
        '정말 구독을 취소하시겠습니까? 현재 결제 기간이 끝나면 무료 플랜으로 전환됩니다.',
      okText: '취소하기',
      okType: 'danger',
      cancelText: '닫기',
      onOk: () => {
        cancelSubscription()
      },
    })
  }

  if (isLoading || !subscription) {
    return <Card loading />
  }

  return (
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
          <Statistic title="월 요금" value={subscription.price} suffix="원" />
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
                {usage.queries.used} /{' '}
                {usage.queries.limit === -1 ? '무제한' : usage.queries.limit} 사용
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
                {usage.documents.count} /{' '}
                {usage.documents.limit === -1 ? '무제한' : usage.documents.limit} 사용
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
  )
}
