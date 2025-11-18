/**
 * Billing FAQ Component
 */

import { Card, Space } from 'antd'
import { Typography } from 'antd'

const { Text, Paragraph, Title } = Typography

export function BillingFAQ() {
  return (
    <Card>
      <Title level={4}>자주 묻는 질문</Title>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Text strong>언제든지 플랜을 변경할 수 있나요?</Text>
          <Paragraph type="secondary">
            네, 언제든지 업그레이드하거나 다운그레이드할 수 있습니다. 업그레이드 시
            즉시 적용되며, 다운그레이드는 현재 결제 기간이 끝난 후 적용됩니다.
          </Paragraph>
        </div>
        <div>
          <Text strong>환불 정책은 어떻게 되나요?</Text>
          <Paragraph type="secondary">
            결제 후 7일 이내에는 전액 환불이 가능합니다. 7일 이후에는 남은 기간에 대한
            비례 환불이 제공됩니다.
          </Paragraph>
        </div>
        <div>
          <Text strong>엔터프라이즈 플랜은 어떻게 이용하나요?</Text>
          <Paragraph type="secondary">
            엔터프라이즈 플랜은 맞춤형 솔루션입니다. sales@lexikor.ai로 문의하시면
            담당자가 연락드립니다.
          </Paragraph>
        </div>
      </Space>
    </Card>
  )
}
