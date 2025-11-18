/**
 * Service Status Page
 *
 * Public-facing service status page showing real-time system health
 * Similar to GitHub Status, AWS Status, Stripe Status
 */

import { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Timeline,
  Alert,
  Space,
  Progress,
  Statistic,
  Divider,
  Table,
  Badge,
  Tooltip
} from 'antd'
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  ApiOutlined,
  DatabaseOutlined,
  CloudOutlined,
  SafetyOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text, Paragraph } = Typography

interface ServiceComponent {
  name: string
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'under_maintenance'
  uptime: number
  icon: React.ReactNode
  description: string
}

interface Incident {
  id: string
  title: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  severity: 'minor' | 'major' | 'critical'
  started_at: string
  resolved_at: string | null
  updates: {
    timestamp: string
    message: string
    status: string
  }[]
}

interface UptimeDay {
  date: string
  uptime: number
  incidents: number
}

const ServiceStatus = () => {
  const [loading, setLoading] = useState(false)

  // Mock service components
  const services: ServiceComponent[] = [
    {
      name: 'API 서버',
      status: 'operational',
      uptime: 99.98,
      icon: <ApiOutlined style={{ fontSize: 24 }} />,
      description: '메인 API 엔드포인트'
    },
    {
      name: 'AI 서비스',
      status: 'operational',
      uptime: 99.95,
      icon: <ThunderboltOutlined style={{ fontSize: 24 }} />,
      description: 'AI 법률 상담 및 분석'
    },
    {
      name: '데이터베이스',
      status: 'operational',
      uptime: 99.99,
      icon: <DatabaseOutlined style={{ fontSize: 24 }} />,
      description: 'PostgreSQL 데이터베이스'
    },
    {
      name: '파일 스토리지',
      status: 'operational',
      uptime: 99.97,
      icon: <CloudOutlined style={{ fontSize: 24 }} />,
      description: '문서 및 파일 저장소'
    },
    {
      name: '인증 서비스',
      status: 'operational',
      uptime: 99.99,
      icon: <SafetyOutlined style={{ fontSize: 24 }} />,
      description: '사용자 인증 및 권한'
    }
  ]

  // Mock recent incidents
  const recentIncidents: Incident[] = [
    {
      id: '1',
      title: 'API 응답 지연',
      status: 'resolved',
      severity: 'minor',
      started_at: '2025-11-15T10:30:00',
      resolved_at: '2025-11-15T11:15:00',
      updates: [
        {
          timestamp: '2025-11-15T11:15:00',
          message: '문제가 해결되었습니다. 모든 서비스가 정상 작동 중입니다.',
          status: 'resolved'
        },
        {
          timestamp: '2025-11-15T10:45:00',
          message: '원인을 파악했습니다. 데이터베이스 쿼리 최적화를 진행 중입니다.',
          status: 'identified'
        },
        {
          timestamp: '2025-11-15T10:30:00',
          message: 'API 응답 시간이 평소보다 느려지는 현상을 조사 중입니다.',
          status: 'investigating'
        }
      ]
    },
    {
      id: '2',
      title: '정기 유지보수',
      status: 'resolved',
      severity: 'minor',
      started_at: '2025-11-10T02:00:00',
      resolved_at: '2025-11-10T04:30:00',
      updates: [
        {
          timestamp: '2025-11-10T04:30:00',
          message: '유지보수가 완료되었습니다.',
          status: 'resolved'
        },
        {
          timestamp: '2025-11-10T02:00:00',
          message: '정기 유지보수를 시작합니다. 일부 서비스가 일시적으로 중단될 수 있습니다.',
          status: 'identified'
        }
      ]
    }
  ]

  // Generate 90 days uptime data
  const generateUptimeData = (): UptimeDay[] => {
    const data: UptimeDay[] = []
    for (let i = 89; i >= 0; i--) {
      const uptime = 95 + Math.random() * 5 // 95-100%
      data.push({
        date: dayjs().subtract(i, 'days').format('YYYY-MM-DD'),
        uptime: parseFloat(uptime.toFixed(2)),
        incidents: Math.random() > 0.95 ? 1 : 0
      })
    }
    return data
  }

  const uptimeData = generateUptimeData()
  const last90DaysUptime = (uptimeData.reduce((sum, d) => sum + d.uptime, 0) / uptimeData.length).toFixed(2)

  const getStatusConfig = (status: ServiceComponent['status']) => {
    const configs = {
      operational: {
        color: 'success',
        text: '정상 운영',
        icon: <CheckCircleOutlined />,
        badge: 'success'
      },
      degraded: {
        color: 'warning',
        text: '성능 저하',
        icon: <WarningOutlined />,
        badge: 'warning'
      },
      partial_outage: {
        color: 'error',
        text: '부분 장애',
        icon: <CloseCircleOutlined />,
        badge: 'error'
      },
      major_outage: {
        color: 'error',
        text: '주요 장애',
        icon: <CloseCircleOutlined />,
        badge: 'error'
      },
      under_maintenance: {
        color: 'processing',
        text: '유지보수 중',
        icon: <SyncOutlined spin />,
        badge: 'processing'
      }
    }
    return configs[status]
  }

  const getIncidentStatusConfig = (status: Incident['status']) => {
    const configs = {
      investigating: { color: 'processing', text: '조사 중' },
      identified: { color: 'warning', text: '원인 파악' },
      monitoring: { color: 'default', text: '모니터링' },
      resolved: { color: 'success', text: '해결됨' }
    }
    return configs[status]
  }

  const getSeverityConfig = (severity: Incident['severity']) => {
    const configs = {
      minor: { color: 'default', text: '경미' },
      major: { color: 'warning', text: '중요' },
      critical: { color: 'error', text: '심각' }
    }
    return configs[severity]
  }

  const allOperational = services.every(s => s.status === 'operational')

  const columns: ColumnsType<ServiceComponent> = [
    {
      title: '서비스',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {record.icon}
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.description}</Text>
          </div>
        </Space>
      )
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = getStatusConfig(status)
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.text}
          </Tag>
        )
      }
    },
    {
      title: '가동률 (90일)',
      dataIndex: 'uptime',
      key: 'uptime',
      render: (uptime) => (
        <Space>
          <Progress
            percent={uptime}
            size="small"
            strokeColor={uptime >= 99.9 ? '#52c41a' : uptime >= 99 ? '#faad14' : '#ff4d4f'}
            style={{ width: 100 }}
          />
          <Text strong>{uptime}%</Text>
        </Space>
      )
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 40,
          color: '#fff'
        }}>
          <Title level={1} style={{ color: '#fff', marginBottom: 8 }}>
            LexiKor 서비스 상태
          </Title>
          <Paragraph style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)' }}>
            실시간 시스템 상태 및 과거 장애 이력
          </Paragraph>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
            마지막 업데이트: {dayjs().format('YYYY-MM-DD HH:mm:ss')} KST
          </Text>
        </div>

        {/* Overall Status */}
        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          {allOperational ? (
            <Alert
              message="모든 시스템 정상 운영 중"
              description="현재 모든 서비스가 정상적으로 작동하고 있습니다."
              type="success"
              showIcon
              icon={<CheckCircleOutlined style={{ fontSize: 24 }} />}
              style={{ fontSize: 16 }}
            />
          ) : (
            <Alert
              message="일부 서비스에 문제가 발생했습니다"
              description="자세한 내용은 아래 서비스 상태를 확인하세요."
              type="warning"
              showIcon
              icon={<WarningOutlined style={{ fontSize: 24 }} />}
              style={{ fontSize: 16 }}
            />
          )}
        </Card>

        {/* Service Components Status */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ApiOutlined />
              <span>서비스 컴포넌트 상태</span>
            </div>
          }
          style={{ marginBottom: 24, borderRadius: 12 }}
        >
          <Table
            columns={columns}
            dataSource={services}
            rowKey="name"
            pagination={false}
            loading={loading}
          />
        </Card>

        {/* Uptime Overview */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card title="전체 가동률" style={{ borderRadius: 12 }}>
              <Statistic
                value={last90DaysUptime}
                suffix="%"
                precision={2}
                valueStyle={{ color: '#52c41a', fontSize: 48 }}
              />
              <Text type="secondary">지난 90일 평균</Text>
              <Divider />
              <div>
                <Text strong>가동률 히스토리 (최근 90일)</Text>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(30, 1fr)',
                  gap: 2,
                  marginTop: 12
                }}>
                  {uptimeData.slice(-90).map((day, i) => (
                    <Tooltip
                      key={i}
                      title={`${day.date}: ${day.uptime}% ${day.incidents > 0 ? '(장애 발생)' : ''}`}
                    >
                      <div
                        style={{
                          height: 30,
                          background: day.uptime >= 99.9 ? '#52c41a' :
                                    day.uptime >= 99 ? '#faad14' :
                                    day.uptime >= 95 ? '#ff7a45' : '#ff4d4f',
                          borderRadius: 2,
                          cursor: 'pointer'
                        }}
                      />
                    </Tooltip>
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 8,
                  fontSize: 12,
                  color: 'rgba(0,0,0,0.45)'
                }}>
                  <span>90일 전</span>
                  <span>오늘</span>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="응답 시간" style={{ borderRadius: 12 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="평균 응답 시간"
                    value={145}
                    suffix="ms"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="P95 응답 시간"
                    value={320}
                    suffix="ms"
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Col>
              </Row>
              <Divider />
              <Row gutter={16}>
                <Col span={12}>
                  <Text type="secondary">오늘 요청 수</Text>
                  <div style={{ fontSize: 24, fontWeight: 500 }}>1,234,567</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">성공률</Text>
                  <div style={{ fontSize: 24, fontWeight: 500, color: '#52c41a' }}>99.98%</div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Recent Incidents */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClockCircleOutlined />
              <span>최근 장애 및 유지보수 이력</span>
            </div>
          }
          style={{ borderRadius: 12 }}
        >
          {recentIncidents.length === 0 ? (
            <Alert
              message="최근 30일간 장애가 발생하지 않았습니다"
              type="success"
              showIcon
            />
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {recentIncidents.map((incident) => (
                <Card key={incident.id} type="inner">
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Tag color={getIncidentStatusConfig(incident.status).color}>
                        {getIncidentStatusConfig(incident.status).text}
                      </Tag>
                      <Tag color={getSeverityConfig(incident.severity).color}>
                        {getSeverityConfig(incident.severity).text}
                      </Tag>
                    </Space>
                    <Title level={5} style={{ marginTop: 8, marginBottom: 4 }}>
                      {incident.title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(incident.started_at).format('YYYY-MM-DD HH:mm')} -{' '}
                      {incident.resolved_at ?
                        dayjs(incident.resolved_at).format('YYYY-MM-DD HH:mm') :
                        '진행 중'
                      }
                      {incident.resolved_at && (
                        <span>
                          {' '}(소요 시간: {dayjs(incident.resolved_at).diff(dayjs(incident.started_at), 'minute')}분)
                        </span>
                      )}
                    </Text>
                  </div>

                  <Timeline
                    items={incident.updates.map((update) => ({
                      color: getIncidentStatusConfig(update.status as Incident['status']).color,
                      children: (
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {dayjs(update.timestamp).format('YYYY-MM-DD HH:mm')}
                          </Text>
                          <div style={{ marginTop: 4 }}>{update.message}</div>
                        </div>
                      )
                    }))}
                  />
                </Card>
              ))}
            </Space>
          )}
        </Card>

        {/* Footer */}
        <Card style={{ marginTop: 24, textAlign: 'center', borderRadius: 12 }}>
          <Text type="secondary">
            문의사항이나 문제가 있으신가요?{' '}
            <a href="mailto:support@lexikor.ai">support@lexikor.ai</a> 또는{' '}
            <a href="tel:02-1234-5678">02-1234-5678</a>로 연락주세요.
          </Text>
          <Divider />
          <Space split="|">
            <a href="/">홈으로</a>
            <a href="/faq">FAQ</a>
            <a href="https://twitter.com/lexikor" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          </Space>
        </Card>
      </div>
    </div>
  )
}

export default ServiceStatus
