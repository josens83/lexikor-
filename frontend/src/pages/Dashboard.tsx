import { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Typography, Button, List, Alert, message, Progress, FloatButton } from 'antd'
import { FileTextOutlined, MessageOutlined, SearchOutlined, ArrowUpOutlined, MailOutlined, CrownOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { analyticsAPI, authAPI, billingAPI } from '../services/api'
import { DashboardSkeleton } from '../components/LoadingSkeleton'
import OnboardingChecklist from '../components/OnboardingChecklist'
import OnboardingTour from '../components/OnboardingTour'

const { Title } = Typography

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [usage, setUsage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [resendingEmail, setResendingEmail] = useState(false)

  // Onboarding states
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    loadDashboardData()
    loadUserInfo()
    loadSubscriptionInfo()

    // Check if first time user
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    const hasSeenTour = localStorage.getItem('hasSeenTour')

    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }

    if (!hasSeenTour) {
      // Show tour after a short delay
      setTimeout(() => setShowTour(true), 1000)
    }
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

  const loadUserInfo = async () => {
    try {
      const response = await authAPI.getMe()
      setUser(response.data)
    } catch (error) {
      console.error('Failed to load user info:', error)
    }
  }

  const loadSubscriptionInfo = async () => {
    try {
      const [subResponse, usageResponse] = await Promise.all([
        billingAPI.getSubscription(),
        billingAPI.getUsage()
      ])
      setSubscription(subResponse.data)
      setUsage(usageResponse.data)
    } catch (error) {
      console.error('Failed to load subscription:', error)
    }
  }

  const handleResendVerification = async () => {
    setResendingEmail(true)
    try {
      await authAPI.resendVerification()
      message.success('인증 이메일이 재발송되었습니다. 이메일함을 확인해주세요.')
    } catch (error: any) {
      message.error(error.response?.data?.detail || '이메일 재발송에 실패했습니다.')
    } finally {
      setResendingEmail(false)
    }
  }

  const handleDismissOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true')
    setShowOnboarding(false)
  }

  const handleFinishTour = () => {
    localStorage.setItem('hasSeenTour', 'true')
    setShowTour(false)
  }

  const handleRestartTour = () => {
    setShowTour(true)
  }

  const quickActions = [
    { title: 'AI 채팅 시작', icon: <MessageOutlined />, path: '/chat', color: '#1890ff' },
    { title: '문서 업로드', icon: <FileTextOutlined />, path: '/documents', color: '#52c41a' },
    { title: '판례 검색', icon: <SearchOutlined />, path: '/research', color: '#faad14' },
  ]

  // Show skeleton while loading
  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2}>대시보드</Title>

          {/* 이메일 미인증 배너 */}
          {user && !user.is_verified && (
            <Alert
              message="이메일 인증이 필요합니다"
              description={
                <div>
                  <p>
                    모든 기능을 이용하시려면 이메일 인증을 완료해주세요.
                    <strong> {user.email}</strong>로 발송된 인증 링크를 확인해주세요.
                  </p>
                  <Button
                    type="primary"
                    size="small"
                    icon={<MailOutlined />}
                    loading={resendingEmail}
                    onClick={handleResendVerification}
                    style={{ marginTop: 8 }}
                  >
                    인증 이메일 재발송
                  </Button>
                </div>
              }
              type="warning"
              showIcon
              closable
              style={{ marginBottom: 24 }}
            />
          )}

          {/* 사용량 제한 알림 배너 */}
          {subscription && subscription.plan === 'FREE' && usage && (
            (() => {
              const queryUsagePercent = subscription.query_limit > 0
                ? (usage.queries_used / subscription.query_limit) * 100
                : 0
              const shouldShowWarning = queryUsagePercent >= 70

              if (shouldShowWarning) {
                return (
                  <Alert
                    message={queryUsagePercent >= 90 ? "무료 사용량이 거의 소진되었습니다" : "무료 사용량 알림"}
                    description={
                      <div>
                        <p>
                          이번 달 AI 쿼리를 <strong>{usage.queries_used}/{subscription.query_limit}</strong>회 사용했습니다.
                        </p>
                        <Progress
                          percent={Math.round(queryUsagePercent)}
                          status={queryUsagePercent >= 90 ? "exception" : "active"}
                          style={{ marginBottom: 12 }}
                        />
                        <p>
                          Professional 플랜으로 업그레이드하시면 무제한으로 사용하실 수 있습니다.
                        </p>
                        <Button
                          type="primary"
                          size="small"
                          icon={<CrownOutlined />}
                          onClick={() => navigate('/billing')}
                          style={{
                            marginTop: 8,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none'
                          }}
                        >
                          플랜 업그레이드
                        </Button>
                      </div>
                    }
                    type={queryUsagePercent >= 90 ? "error" : "info"}
                    showIcon
                    closable
                    style={{ marginBottom: 24 }}
                  />
                )
              }
              return null
            })()
          )}

          {/* 온보딩 체크리스트 */}
          {showOnboarding && user && (
            <OnboardingChecklist user={user} onDismiss={handleDismissOnboarding} />
          )}

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

      {/* Onboarding Tour */}
      <OnboardingTour open={showTour} onFinish={handleFinishTour} />

      {/* Help Button - Floating */}
      <FloatButton
        icon={<QuestionCircleOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24 }}
        tooltip="도움말"
        onClick={handleRestartTour}
      />
    </div>
  )
}

export default Dashboard
