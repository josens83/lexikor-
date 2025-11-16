import { useEffect, useState } from 'react'
import { Layout, Card, Row, Col, Statistic, Typography, Button, List } from 'antd'
import { FileTextOutlined, MessageOutlined, SearchOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { analyticsAPI } from '../services/api'

const { Title } = Typography
const { Content } = Layout

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await analyticsAPI.getDashboard()
      setStats(response.data)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { title: 'AI 채팅 시작', icon: <MessageOutlined />, path: '/chat', color: '#1890ff' },
    { title: '문서 업로드', icon: <FileTextOutlined />, path: '/documents', color: '#52c41a' },
    { title: '판례 검색', icon: <SearchOutlined />, path: '/research', color: '#faad14' },
  ]

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2}>대시보드</Title>

          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="총 대화"
                  value={stats?.overview?.total_conversations || 0}
                  prefix={<MessageOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="총 쿼리"
                  value={stats?.overview?.total_queries || 0}
                  prefix={<MessageOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="문서"
                  value={stats?.overview?.total_documents || 0}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="이번 달 쿼리"
                  value={stats?.overview?.queries_this_month || 0}
                  prefix={<ArrowUpOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="빠른 실행" loading={loading}>
                <List
                  dataSource={quickActions}
                  renderItem={(item) => (
                    <List.Item>
                      <Button
                        type="dashed"
                        size="large"
                        block
                        icon={item.icon}
                        onClick={() => navigate(item.path)}
                        style={{ textAlign: 'left', height: '60px' }}
                      >
                        {item.title}
                      </Button>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="구독 정보" loading={loading}>
                <Statistic
                  title="현재 플랜"
                  value={stats?.subscription?.plan || 'Free'}
                  valueStyle={{ color: '#1890ff' }}
                />
                <div style={{ marginTop: '16px' }}>
                  <p>사용량: {stats?.subscription?.queries_used || 0} / {stats?.subscription?.query_limit || 20}</p>
                  <Button type="primary" block onClick={() => navigate('/billing')}>
                    플랜 업그레이드
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  )
}

export default Dashboard
