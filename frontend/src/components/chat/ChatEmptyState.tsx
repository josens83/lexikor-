/**
 * ChatEmptyState Component
 * Welcome screen with suggested questions
 *
 * @module components/chat/ChatEmptyState
 * @lines < 90
 */

import { Space, Typography, Card, Row, Col } from 'antd'
import {
  MessageOutlined,
  FileTextOutlined,
  SearchOutlined,
  BulbOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

export interface ChatEmptyStateProps {
  onSuggestionClick?: (question: string) => void
}

const SUGGESTIONS = [
  {
    icon: <FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
    title: '계약서 검토',
    question: '임대차 계약서에서 주의해야 할 조항들은 무엇인가요?',
  },
  {
    icon: <SearchOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
    title: '판례 검색',
    question: '부당해고와 관련된 최근 대법원 판례를 알려주세요.',
  },
  {
    icon: <BulbOutlined style={{ fontSize: 24, color: '#faad14' }} />,
    title: '법률 자문',
    question: '개인사업자가 알아야 할 세금 관련 법률은 무엇인가요?',
  },
  {
    icon: <MessageOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
    title: '분쟁 해결',
    question: '온라인 쇼핑몰에서 환불을 거부당했을 때 어떻게 해야 하나요?',
  },
]

const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({ onSuggestionClick }) => {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2} style={{ marginBottom: 8 }}>
            법률 AI 어시스턴트
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            법률 관련 질문을 입력하시면 관련 판례와 법령을 인용하여 답변해드립니다.
          </Text>
        </div>

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          {SUGGESTIONS.map((item, index) => (
            <Col xs={24} sm={12} key={index}>
              <Card
                hoverable
                style={{ height: '100%', textAlign: 'left' }}
                onClick={() => onSuggestionClick?.(item.question)}
              >
                <Space direction="vertical" size="small">
                  <Space>
                    {item.icon}
                    <Text strong>{item.title}</Text>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {item.question}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <Text type="secondary" style={{ fontSize: 12, marginTop: 24 }}>
          본 서비스는 일반적인 법률 정보 제공을 목적으로 하며, 구체적인 법률 자문을
          대체하지 않습니다.
        </Text>
      </Space>
    </div>
  )
}

export default ChatEmptyState
