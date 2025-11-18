/**
 * Billing Page - Refactored with Component Extraction
 *
 * Reduced from 435 lines to ~70 lines by extracting section components
 */

import { Card, Row, Col, Typography, Button } from 'antd'
import { HistoryOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { CurrentSubscriptionCard, PlanCards, BillingFAQ } from '@components/billing'

const { Title, Paragraph } = Typography

const Billing = () => {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Title level={2} style={{ marginBottom: 8 }}>
                    결제 및 구독
                  </Title>
                  <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    요금제를 선택하고 구독을 관리하세요. 언제든지 업그레이드하거나 취소할 수
                    있습니다.
                  </Paragraph>
                </div>
                <Button icon={<HistoryOutlined />} onClick={() => navigate('/billing/history')}>
                  결제 내역 보기
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Current Subscription */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <CurrentSubscriptionCard />
          </Col>
        </Row>

        {/* Plan Cards */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <PlanCards />
        </Row>

        {/* FAQ */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <BillingFAQ />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Billing
