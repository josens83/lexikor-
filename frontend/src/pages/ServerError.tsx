/**
 * 500 Server Error Page
 *
 * Professional error page for server/application errors
 * Similar to Stripe, Notion, GitHub 500 pages
 */

import { Result, Button, Space, Card, Typography, Alert, Collapse } from 'antd'
import {
  HomeOutlined,
  ReloadOutlined,
  WarningOutlined,
  SafetyOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse

const ServerError = () => {
  const navigate = useNavigate()
  const [retrying, setRetrying] = useState(false)

  const handleRetry = () => {
    setRetrying(true)
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  const troubleshootingSteps = [
    {
      title: '페이지 새로고침',
      description: '일시적인 문제일 수 있습니다. 페이지를 새로고침해보세요.',
      icon: <ReloadOutlined />
    },
    {
      title: '잠시 후 재시도',
      description: '서버가 일시적으로 응답하지 않을 수 있습니다. 1-2분 후 다시 시도해주세요.',
      icon: <ClockCircleOutlined />
    },
    {
      title: '브라우저 캐시 삭제',
      description: '브라우저 캐시를 삭제하고 다시 로그인해보세요.',
      icon: <SafetyOutlined />
    },
    {
      title: '고객 지원팀 문의',
      description: '문제가 계속되면 고객 지원팀에 문의하세요.',
      icon: <WarningOutlined />
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ maxWidth: 700, width: '100%' }}>
        <Card
          style={{
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}
        >
          <Result
            status="500"
            title={
              <div>
                <Title level={1} style={{ marginBottom: 0, color: '#ff4d4f' }}>
                  500
                </Title>
                <Title level={3} style={{ fontWeight: 'normal', color: 'rgba(0,0,0,0.65)' }}>
                  서버 오류가 발생했습니다
                </Title>
              </div>
            }
            subTitle={
              <div style={{ marginTop: 16 }}>
                <Paragraph style={{ fontSize: 16, marginBottom: 8 }}>
                  죄송합니다. 서버에서 예기치 않은 오류가 발생했습니다.
                </Paragraph>
                <Paragraph type="secondary">
                  저희 팀이 자동으로 알림을 받았으며 문제를 해결하고 있습니다.
                  잠시 후 다시 시도해주세요.
                </Paragraph>
              </div>
            }
            extra={
              <Space size="middle" style={{ marginTop: 24 }}>
                <Button
                  type="default"
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={handleRetry}
                  loading={retrying}
                >
                  페이지 새로고침
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

          {/* Status Alert */}
          <div style={{ padding: '0 24px 24px' }}>
            <Alert
              message="시스템 상태"
              description={
                <div>
                  <Paragraph style={{ marginBottom: 8 }}>
                    현재 서버가 일시적으로 응답하지 않거나 과부하 상태일 수 있습니다.
                    대부분의 경우 몇 분 내에 자동으로 복구됩니다.
                  </Paragraph>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    서비스 상태: <a href="https://status.lexikor.ai" target="_blank" rel="noopener noreferrer">
                      status.lexikor.ai
                    </a> (실시간 모니터링)
                  </Text>
                </div>
              }
              type="warning"
              showIcon
              icon={<WarningOutlined />}
              style={{ marginTop: 16 }}
            />
          </div>

          {/* Troubleshooting */}
          <div style={{ padding: '0 24px 24px' }}>
            <Collapse
              bordered={false}
              style={{ background: '#fafafa' }}
            >
              <Panel header="문제 해결 가이드" key="1">
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {troubleshootingSteps.map((step, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{
                        fontSize: 20,
                        color: '#1890ff',
                        marginTop: 2
                      }}>
                        {step.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ display: 'block', marginBottom: 4 }}>
                          {index + 1}. {step.title}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {step.description}
                        </Text>
                      </div>
                    </div>
                  ))}
                </Space>
              </Panel>
            </Collapse>
          </div>

          {/* Technical Details (for developers) */}
          <div style={{ padding: '0 24px 24px' }}>
            <details style={{ cursor: 'pointer' }}>
              <summary style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', marginBottom: 8 }}>
                기술 정보 (개발자용)
              </summary>
              <div style={{
                background: '#f5f5f5',
                padding: 12,
                borderRadius: 4,
                fontSize: 12,
                fontFamily: 'monospace'
              }}>
                <div>Error Type: Internal Server Error</div>
                <div>Status Code: 500</div>
                <div>Timestamp: {new Date().toISOString()}</div>
                <div>User Agent: {navigator.userAgent}</div>
              </div>
            </details>
          </div>

          {/* Support Info */}
          <div style={{
            background: '#f5f5f5',
            padding: '16px 24px',
            marginTop: 24,
            textAlign: 'center'
          }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              문제가 계속 발생하시나요?
            </Text>
            <Space split="|" size="small">
              <a href="mailto:support@lexikor.ai" style={{ fontWeight: 500 }}>
                이메일: support@lexikor.ai
              </a>
              <a href="tel:02-1234-5678" style={{ fontWeight: 500 }}>
                전화: 02-1234-5678
              </a>
            </Space>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                평일 09:00-18:00 (주말 및 공휴일 제외)
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ServerError
