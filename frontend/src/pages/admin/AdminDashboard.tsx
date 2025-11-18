/**
 * Admin Dashboard - System Overview
 *
 * Comprehensive admin dashboard for system monitoring and management
 * Similar to Stripe Dashboard, Firebase Console, AWS Console
 */

import { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Space,
  Typography,
  Alert,
  Progress,
  Tabs,
  Button,
  Select,
  DatePicker
} from 'antd'
import {
  UserOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  FileTextOutlined,
  MessageOutlined,
  EyeOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Title, Text, Paragraph } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

// Mock data interfaces
interface SystemStats {
  total_users: number
  active_users: number
  new_users_today: number
  total_revenue: number
  mrr: number
  revenue_growth: number
  total_documents: number
  total_chats: number
  total_queries: number
  system_health: 'healthy' | 'warning' | 'critical'
  cpu_usage: number
  memory_usage: number
  disk_usage: number
}

interface RecentUser {
  id: string
  email: string
  name: string
  plan: string
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  last_login: string
}

interface RecentActivity {
  id: string
  user_email: string
  action: string
  resource: string
  timestamp: string
  status: 'success' | 'failed' | 'pending'
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'days'),
    dayjs()
  ])

  // Mock system stats
  const [stats, setStats] = useState<SystemStats>({
    total_users: 1247,
    active_users: 893,
    new_users_today: 23,
    total_revenue: 45680000,
    mrr: 3250000,
    revenue_growth: 12.5,
    total_documents: 5432,
    total_chats: 12890,
    total_queries: 45678,
    system_health: 'healthy',
    cpu_usage: 42,
    memory_usage: 68,
    disk_usage: 45
  })

  // Mock recent users
  const recentUsers: RecentUser[] = [
    {
      id: '1',
      email: 'john@company.com',
      name: '김철수',
      plan: 'Enterprise',
      status: 'active',
      created_at: '2025-11-18 14:30',
      last_login: '2025-11-18 16:45'
    },
    {
      id: '2',
      email: 'sarah@startup.com',
      name: '이영희',
      plan: 'Professional',
      status: 'active',
      created_at: '2025-11-18 09:15',
      last_login: '2025-11-18 16:20'
    },
    {
      id: '3',
      email: 'mike@law.com',
      name: '박민수',
      plan: 'Free',
      status: 'active',
      created_at: '2025-11-17 18:00',
      last_login: '2025-11-18 10:30'
    }
  ]

  // Mock recent activities
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      user_email: 'john@company.com',
      action: 'Document Upload',
      resource: 'contract_v2.pdf',
      timestamp: '2025-11-18 16:45',
      status: 'success'
    },
    {
      id: '2',
      user_email: 'sarah@startup.com',
      action: 'AI Chat',
      resource: 'Legal consultation',
      timestamp: '2025-11-18 16:40',
      status: 'success'
    },
    {
      id: '3',
      user_email: 'mike@law.com',
      action: 'Template Generated',
      resource: 'NDA Template',
      timestamp: '2025-11-18 16:35',
      status: 'success'
    }
  ]

  const userColumns: ColumnsType<RecentUser> = [
    {
      title: '사용자',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
        </div>
      )
    },
    {
      title: '플랜',
      dataIndex: 'plan',
      key: 'plan',
      render: (plan) => {
        const colors: Record<string, string> = {
          'Enterprise': 'purple',
          'Professional': 'blue',
          'Free': 'default'
        }
        return <Tag color={colors[plan]}>{plan}</Tag>
      }
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config: Record<string, { color: string; text: string }> = {
          'active': { color: 'success', text: '활성' },
          'inactive': { color: 'default', text: '비활성' },
          'suspended': { color: 'error', text: '정지' }
        }
        return <Tag color={config[status].color}>{config[status].text}</Tag>
      }
    },
    {
      title: '가입일',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '마지막 로그인',
      dataIndex: 'last_login',
      key: 'last_login',
      render: (date) => dayjs(date).fromNow()
    },
    {
      title: '작업',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Link to={`/admin/users/${record.id}`}>
            <Button type="link" size="small" icon={<EyeOutlined />}>
              상세
            </Button>
          </Link>
        </Space>
      )
    }
  ]

  const activityColumns: ColumnsType<RecentActivity> = [
    {
      title: '사용자',
      dataIndex: 'user_email',
      key: 'user_email'
    },
    {
      title: '작업',
      dataIndex: 'action',
      key: 'action',
      render: (action) => <Tag>{action}</Tag>
    },
    {
      title: '리소스',
      dataIndex: 'resource',
      key: 'resource'
    },
    {
      title: '시간',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time) => dayjs(time).fromNow()
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config: Record<string, { icon: React.ReactNode; color: string }> = {
          'success': { icon: <CheckCircleOutlined />, color: 'success' },
          'failed': { icon: <WarningOutlined />, color: 'error' },
          'pending': { icon: <ClockCircleOutlined />, color: 'processing' }
        }
        return <Tag icon={config[status].icon} color={config[status].color}>{status}</Tag>
      }
    }
  ]

  const getHealthColor = () => {
    switch (stats.system_health) {
      case 'healthy': return 'success'
      case 'warning': return 'warning'
      case 'critical': return 'error'
      default: return 'default'
    }
  }

  const getHealthText = () => {
    switch (stats.system_health) {
      case 'healthy': return '정상'
      case 'warning': return '주의'
      case 'critical': return '위험'
      default: return '알 수 없음'
    }
  }

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          관리자 대시보드
        </Title>
        <Space style={{ marginBottom: 16 }}>
          <RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            format="YYYY-MM-DD"
          />
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">전체</Option>
            <Option value="users">사용자</Option>
            <Option value="revenue">수익</Option>
            <Option value="usage">사용량</Option>
          </Select>
        </Space>
      </div>

      {/* System Health Alert */}
      {stats.system_health !== 'healthy' && (
        <Alert
          message="시스템 상태 주의"
          description="일부 시스템 리소스가 높은 사용률을 보이고 있습니다. 시스템 모니터링 페이지에서 확인하세요."
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" type="link">
              상세 보기
            </Button>
          }
        />
      )}

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="총 사용자"
              value={stats.total_users}
              prefix={<UserOutlined />}
              suffix={
                <div style={{ fontSize: 14 }}>
                  <Text type="secondary">활성: {stats.active_users}</Text>
                </div>
              }
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="green" icon={<RiseOutlined />}>
                오늘 +{stats.new_users_today}
              </Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="월 반복 수익 (MRR)"
              value={stats.mrr}
              prefix={<DollarOutlined />}
              suffix="원"
              precision={0}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color={stats.revenue_growth > 0 ? 'green' : 'red'}>
                {stats.revenue_growth > 0 ? <RiseOutlined /> : <FallOutlined />}
                {Math.abs(stats.revenue_growth)}%
              </Tag>
              <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                vs 지난달
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="총 수익"
              value={stats.total_revenue}
              prefix="₩"
              precision={0}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                전체 누적 수익
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="시스템 상태"
              value={getHealthText()}
              prefix={
                stats.system_health === 'healthy' ?
                <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                <WarningOutlined style={{ color: '#faad14' }} />
              }
            />
            <div style={{ marginTop: 8 }}>
              <Tag color={getHealthColor()}>
                {stats.system_health.toUpperCase()}
              </Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Usage Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="총 문서"
              value={stats.total_documents}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="총 채팅"
              value={stats.total_chats}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="총 AI 쿼리"
              value={stats.total_queries}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* System Resources */}
      <Card title="시스템 리소스" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div>
              <Text strong>CPU 사용률</Text>
              <Progress
                percent={stats.cpu_usage}
                status={stats.cpu_usage > 80 ? 'exception' : 'normal'}
                style={{ marginTop: 8 }}
              />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div>
              <Text strong>메모리 사용률</Text>
              <Progress
                percent={stats.memory_usage}
                status={stats.memory_usage > 80 ? 'exception' : 'normal'}
                style={{ marginTop: 8 }}
              />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div>
              <Text strong>디스크 사용률</Text>
              <Progress
                percent={stats.disk_usage}
                status={stats.disk_usage > 80 ? 'exception' : 'normal'}
                style={{ marginTop: 8 }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Tabs for Recent Data */}
      <Card>
        <Tabs
          defaultActiveKey="users"
          items={[
            {
              key: 'users',
              label: (
                <span>
                  <UserOutlined />
                  최근 가입 사용자
                </span>
              ),
              children: (
                <Table
                  columns={userColumns}
                  dataSource={recentUsers}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  loading={loading}
                />
              )
            },
            {
              key: 'activities',
              label: (
                <span>
                  <ClockCircleOutlined />
                  최근 활동
                </span>
              ),
              children: (
                <Table
                  columns={activityColumns}
                  dataSource={recentActivities}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  loading={loading}
                />
              )
            }
          ]}
        />
      </Card>

      {/* Quick Actions */}
      <Card title="빠른 작업" style={{ marginTop: 24 }}>
        <Space wrap>
          <Link to="/admin/users">
            <Button type="primary" icon={<UserOutlined />}>
              사용자 관리
            </Button>
          </Link>
          <Link to="/admin/subscriptions">
            <Button icon={<DollarOutlined />}>
              구독 관리
            </Button>
          </Link>
          <Link to="/admin/settings">
            <Button icon={<SettingOutlined />}>
              시스템 설정
            </Button>
          </Link>
          <Button icon={<EyeOutlined />}>
            상세 로그 보기
          </Button>
        </Space>
      </Card>
    </div>
  )
}

export default AdminDashboard
