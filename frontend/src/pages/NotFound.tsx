/**
 * 404 Not Found Error Page
 *
 * Professional branded error page with helpful actions
 * Similar to Stripe, Notion, GitHub 404 pages
 */

import { Result, Button, Space, Card, Typography, Row, Col } from 'antd'
import { HomeOutlined, SearchOutlined, QuestionCircleOutlined, LeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography

const NotFound = () => {
  const navigate = useNavigate()

  const suggestions = [
    {
      title: '대시보드로 이동',
      description: '메인 대시보드에서 다시 시작하세요',
      icon: <HomeOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      action: () => navigate('/dashboard')
    },
    {
      title: 'AI 채팅 시작',
      description: 'AI 법률 상담을 시작해보세요',
      icon: <SearchOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      action: () => navigate('/chat')
    },
    {
      title: '도움말 센터',
      description: '자주 묻는 질문을 확인하세요',
      icon: <QuestionCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />,
      action: () => navigate('/faq')
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ maxWidth: 800, width: '100%' }}>
        <Card
          style={{
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}
        >
          <Result
            status="404"
            title={
              <div>
                <Title level={1} style={{ marginBottom: 0 }}>
                  404
                </Title>
                <Title level={3} style={{ fontWeight: 'normal', color: 'rgba(0,0,0,0.65)' }}>
                  페이지를 찾을 수 없습니다
                </Title>
              </div>
            }
            subTitle={
              <div style={{ marginTop: 16 }}>
                <Paragraph style={{ fontSize: 16, marginBottom: 8 }}>
                  요청하신 페이지가 존재하지 않거나 이동되었습니다.
                </Paragraph>
                <Paragraph type="secondary">
                  URL을 다시 확인하시거나 아래 버튼을 통해 다른 페이지로 이동하실 수 있습니다.
                </Paragraph>
              </div>
            }
            extra={
              <Space size="middle" style={{ marginTop: 24 }}>
                <Button
                  type="default"
                  size="large"
                  icon={<LeftOutlined />}
                  onClick={() => navigate(-1)}
                >
                  이전 페이지
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<HomeOutlined />}
                  onClick={() => navigate('/dashboard')}
                >
                  홈으로 이동
                </Button>
              </Space>
            }
          />

          {/* Helpful Suggestions */}
          <div style={{ padding: '0 24px 24px', marginTop: 24 }}>
            <Title level={5} style={{ marginBottom: 16 }}>
              다음 페이지를 찾으시나요?
            </Title>
            <Row gutter={[16, 16]}>
              {suggestions.map((suggestion, index) => (
                <Col xs={24} sm={8} key={index}>
                  <Card
                    hoverable
                    onClick={suggestion.action}
                    style={{
                      textAlign: 'center',
                      cursor: 'pointer',
                      height: '100%'
                    }}
                  >
                    <div style={{ marginBottom: 12 }}>
                      {suggestion.icon}
                    </div>
                    <Title level={5} style={{ marginBottom: 8 }}>
                      {suggestion.title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {suggestion.description}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Support Info */}
          <div style={{
            background: '#f5f5f5',
            padding: '16px 24px',
            marginTop: 24,
            textAlign: 'center'
          }}>
            <Text type="secondary">
              문제가 계속되나요?{' '}
              <a href="mailto:support@lexikor.ai" style={{ fontWeight: 500 }}>
                support@lexikor.ai
              </a>
              {' '}로 문의하시거나{' '}
              <a href="tel:02-1234-5678" style={{ fontWeight: 500 }}>
                02-1234-5678
              </a>
              {' '}로 전화주세요.
            </Text>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default NotFound
