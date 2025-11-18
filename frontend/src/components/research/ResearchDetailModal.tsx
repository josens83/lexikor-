/**
 * Research Detail Modal Component
 */

import { Modal, Space, Tag, Card, Button } from 'antd'
import { Typography } from 'antd'

const { Text, Paragraph, Title } = Typography

interface ResearchDetailModalProps {
  visible: boolean
  onClose: () => void
  item: any | null
}

export function ResearchDetailModal({
  visible,
  onClose,
  item,
}: ResearchDetailModalProps) {
  if (!item) return null

  return (
    <Modal
      title={item.type === 'case' ? '판례 상세 정보' : '법령 상세 정보'}
      open={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="close" onClick={onClose}>
          닫기
        </Button>,
      ]}
    >
      {item.type === 'case' && (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text type="secondary">사건번호</Text>
            <Title level={4}>{item.case_number}</Title>
            <Text>{item.case_name}</Text>
          </div>

          <div>
            <Title level={5}>기본 정보</Title>
            <Space direction="vertical">
              <Text>법원: {item.court}</Text>
              <Text>사건 유형: {item.case_type}</Text>
              <Text>법률 분야: {item.legal_area}</Text>
              <Text>
                선고일:{' '}
                {item.decision_date
                  ? new Date(item.decision_date).toLocaleDateString('ko-KR')
                  : '-'}
              </Text>
            </Space>
          </div>

          <div>
            <Title level={5}>요약</Title>
            <Paragraph>{item.summary}</Paragraph>
          </div>

          {item.judgment && (
            <div>
              <Title level={5}>판결 주문</Title>
              <Paragraph>{item.judgment}</Paragraph>
            </div>
          )}

          {item.cited_statutes && item.cited_statutes.length > 0 && (
            <div>
              <Title level={5}>인용 법령</Title>
              <Space wrap>
                {item.cited_statutes.map((statute: string, idx: number) => (
                  <Tag key={idx} color="blue">
                    {statute}
                  </Tag>
                ))}
              </Space>
            </div>
          )}
        </Space>
      )}

      {item.type === 'statute' && (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text type="secondary">{item.statute_number}</Text>
            <Title level={4}>{item.statute_name}</Title>
          </div>

          <div>
            <Title level={5}>기본 정보</Title>
            <Space direction="vertical">
              <Text>법령 유형: {item.statute_type}</Text>
              <Text>분야: {item.category}</Text>
              <Text>
                공포일:{' '}
                {item.enacted_date
                  ? new Date(item.enacted_date).toLocaleDateString('ko-KR')
                  : '-'}
              </Text>
              <Text>
                시행일:{' '}
                {item.effective_date
                  ? new Date(item.effective_date).toLocaleDateString('ko-KR')
                  : '-'}
              </Text>
              <Text>
                상태:{' '}
                <Tag color={item.is_active ? 'success' : 'default'}>
                  {item.is_active ? '시행' : '폐지'}
                </Tag>
              </Text>
            </Space>
          </div>

          {item.summary && (
            <div>
              <Title level={5}>요약</Title>
              <Paragraph>{item.summary}</Paragraph>
            </div>
          )}

          {item.articles && item.articles.length > 0 && (
            <div>
              <Title level={5}>주요 조문</Title>
              {item.articles.slice(0, 5).map((article: any, idx: number) => (
                <Card key={idx} size="small" style={{ marginBottom: '8px' }}>
                  <Text strong>
                    {article.number} {article.title}
                  </Text>
                  <Paragraph style={{ marginTop: '8px', marginBottom: 0 }}>
                    {article.content}
                  </Paragraph>
                </Card>
              ))}
            </div>
          )}
        </Space>
      )}
    </Modal>
  )
}
