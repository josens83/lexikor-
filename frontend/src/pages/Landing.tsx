/**
 * Landing Page - Modern Design
 * Linear/Stripe/Notion inspired design
 */

import { Button, Row, Col, Typography, Space, Card } from 'antd'
import {
  RocketOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  StarFilled,
  ArrowRightOutlined,
  ApiOutlined,
  FileTextOutlined,
  MessageOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import '../styles/design-tokens.css'

const { Title, Paragraph, Text } = Typography

const Landing = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <RocketOutlined />,
      title: '빠른 법률 검색',
      description: 'AI가 수천 건의 판례와 법령을 즉시 검색하여 정확한 법률 정보를 제공합니다',
      color: '#6366f1'
    },
    {
      icon: <SafetyOutlined />,
      title: '계약서 자동 분석',
      description: '위험 조항을 자동으로 식별하고 전문적인 수정 제안을 제공합니다',
      color: '#8b5cf6'
    },
    {
      icon: <ThunderboltOutlined />,
      title: '문서 자동 생성',
      description: '소장, 내용증명, 계약서 등을 템플릿으로 빠르게 작성할 수 있습니다',
      color: '#ec4899'
    },
    {
      icon: <TeamOutlined />,
      title: '팀 협업',
      description: '법률사무소 전체가 문서와 정보를 안전하게 공유하며 협업합니다',
      color: '#10b981'
    }
  ]

  const stats = [
    { value: '10,000+', label: '활성 사용자' },
    { value: '99.9%', label: '가동률' },
    { value: '50,000+', label: '분석된 문서' },
    { value: '24/7', label: '고객 지원' }
  ]

  const testimonials = [
    {
      name: '김철수',
      role: '변호사, 법무법인 정의',
      content: 'LexiKor 덕분에 법률 리서치 시간이 70% 단축되었습니다. 이제 고객에게 더 집중할 수 있게 되었어요.',
      rating: 5
    },
    {
      name: '이영희',
      role: 'CEO, 스타트업 법률서비스',
      content: '계약서 검토가 이렇게 빠를 수가! AI 분석이 정말 정확하고 놀라워요.',
      rating: 5
    },
    {
      name: '박민수',
      role: '법무팀장, 대기업',
      content: '팀 전체가 사용하기 쉽고, 문서 관리도 체계적입니다. 강력 추천합니다!',
      rating: 5
    }
  ]

  return (
    <div className="bg-primary" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background Effects */}
      <div className="dot-pattern" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.3,
        pointerEvents: 'none'
      }} />

      {/* Gradient Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <header className="glass-strong" style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid rgba(var(--color-border), 0.1)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <Row justify="space-between" align="middle" style={{ height: '72px' }}>
            <Col>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                <span style={{ fontSize: '28px' }}>⚖️</span>
                <Title level={3} className="gradient-text" style={{ margin: 0, fontWeight: 800, fontSize: '24px' }}>
                  LexiKor
                </Title>
              </div>
            </Col>
            <Col>
              <Space size="large">
                <Button type="text" className="text-primary" onClick={() => navigate('/faq')} style={{ fontWeight: 500 }}>
                  FAQ
                </Button>
                <Button type="text" className="text-primary" onClick={() => navigate('/help')} style={{ fontWeight: 500 }}>
                  도움말
                </Button>
                <Button type="text" className="text-primary" onClick={() => navigate('/login')} style={{ fontWeight: 500 }}>
                  로그인
                </Button>
                <Button
                  type="primary"
                  className="btn-modern btn-primary hover-lift"
                  onClick={() => navigate('/register')}
                  icon={<ArrowRightOutlined />}
                >
                  무료 시작하기
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '120px 24px 100px', position: 'relative' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <span className="glass" style={{
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '14px',
              fontWeight: 600,
              color: 'rgb(var(--color-primary))'
            }}>
              ✨ AI로 법률 업무를 혁신하세요
            </span>
          </div>

          <Title className="text-primary" style={{
            fontSize: '72px',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '24px',
            letterSpacing: '-0.02em'
          }}>
            AI 기반<br />
            <span className="gradient-text">법률 어시스턴트</span>
          </Title>

          <Paragraph className="text-secondary" style={{
            fontSize: '20px',
            maxWidth: '700px',
            margin: '0 auto 48px',
            lineHeight: 1.6
          }}>
            판례 검색, 계약서 분석, 법률 문서 작성을 AI로 자동화하세요.
            <br />
            법률 전문가들이 신뢰하는 No.1 플랫폼
          </Paragraph>

          <Space size="large" wrap>
            <Button
              size="large"
              type="primary"
              className="btn-modern btn-primary hover-lift glow-primary"
              onClick={() => navigate('/register')}
              icon={<RocketOutlined />}
              style={{
                height: '56px',
                padding: '0 32px',
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              14일 무료 체험 시작
            </Button>
            <Button
              size="large"
              className="btn-modern glass"
              onClick={() => navigate('/help')}
              style={{
                height: '56px',
                padding: '0 32px',
                fontSize: '16px',
                fontWeight: 600,
                color: 'rgb(var(--color-text-primary))'
              }}
            >
              자세히 알아보기
            </Button>
          </Space>

          {/* Stats */}
          <Row gutter={48} justify="center" style={{ marginTop: '80px' }}>
            {stats.map((stat, index) => (
              <Col key={index} xs={12} sm={6}>
                <div className="text-center">
                  <div className="gradient-text" style={{
                    fontSize: '48px',
                    fontWeight: 800,
                    marginBottom: '8px'
                  }}>
                    {stat.value}
                  </div>
                  <Text className="text-secondary" style={{ fontSize: '16px' }}>
                    {stat.label}
                  </Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="bg-secondary" style={{ padding: '100px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <Title className="text-primary" style={{
              fontSize: '48px',
              fontWeight: 800,
              marginBottom: '16px'
            }}>
              왜 LexiKor를 선택해야 할까요?
            </Title>
            <Paragraph className="text-secondary" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              최첨단 AI 기술로 법률 업무의 효율성을 극대화하세요
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col key={index} xs={24} sm={12} lg={6}>
                <div className="card-modern hover-lift glow-border" style={{
                  height: '100%',
                  background: 'rgb(var(--color-surface))',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-lg)',
                    background: `linear-gradient(135deg, ${feature.color}33, ${feature.color}11)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    fontSize: '28px',
                    color: feature.color
                  }}>
                    {feature.icon}
                  </div>
                  <Title level={4} className="text-primary" style={{ marginBottom: '12px', fontWeight: 700 }}>
                    {feature.title}
                  </Title>
                  <Paragraph className="text-secondary" style={{ marginBottom: 0, fontSize: '15px' }}>
                    {feature.description}
                  </Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <Title className="text-primary" style={{
              fontSize: '48px',
              fontWeight: 800,
              marginBottom: '16px'
            }}>
              고객들의 이야기
            </Title>
            <Paragraph className="text-secondary" style={{ fontSize: '18px' }}>
              전국의 법률 전문가들이 LexiKor를 사용합니다
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {testimonials.map((testimonial, index) => (
              <Col key={index} xs={24} md={8}>
                <div className="glass hover-scale" style={{
                  padding: 'var(--space-8)',
                  borderRadius: 'var(--radius-xl)',
                  height: '100%',
                  transition: 'all var(--transition-base)'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarFilled key={i} style={{ color: '#faad14', fontSize: '20px', marginRight: '4px' }} />
                    ))}
                  </div>
                  <Paragraph className="text-primary" style={{
                    fontSize: '16px',
                    lineHeight: 1.7,
                    marginBottom: '24px',
                    fontStyle: 'italic'
                  }}>
                    "{testimonial.content}"
                  </Paragraph>
                  <div>
                    <Text strong className="text-primary" style={{ display: 'block', marginBottom: '4px' }}>
                      {testimonial.name}
                    </Text>
                    <Text className="text-secondary" style={{ fontSize: '14px' }}>
                      {testimonial.role}
                    </Text>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-primary" style={{ padding: '100px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <Title style={{
            color: '#fff',
            fontSize: '48px',
            fontWeight: 800,
            marginBottom: '24px'
          }}>
            지금 바로 시작하세요
          </Title>
          <Paragraph style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '20px',
            marginBottom: '48px'
          }}>
            14일 무료 체험으로 LexiKor의 강력한 기능을 경험해보세요
            <br />
            신용카드 등록 불필요
          </Paragraph>

          <Space direction="vertical" size="middle" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            <Button
              size="large"
              className="hover-lift"
              onClick={() => navigate('/register')}
              icon={<ArrowRightOutlined />}
              style={{
                width: '100%',
                height: '56px',
                fontSize: '18px',
                fontWeight: 600,
                background: '#fff',
                color: 'rgb(var(--color-primary))',
                border: 'none'
              }}
            >
              무료로 시작하기
            </Button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '24px' }}>
              <Space direction="vertical" size={4} align="center">
                <CheckCircleOutlined style={{ fontSize: '20px', color: '#fff' }} />
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>신용카드 불필요</Text>
              </Space>
              <Space direction="vertical" size={4} align="center">
                <CheckCircleOutlined style={{ fontSize: '20px', color: '#fff' }} />
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>즉시 사용 가능</Text>
              </Space>
              <Space direction="vertical" size={4} align="center">
                <CheckCircleOutlined style={{ fontSize: '20px', color: '#fff' }} />
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>언제든 취소 가능</Text>
              </Space>
            </div>
          </Space>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary" style={{
        padding: '48px 24px',
        borderTop: '1px solid rgb(var(--color-border))'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Space direction="vertical" size="middle">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>⚖️</span>
                  <Text className="text-primary" strong style={{ fontSize: '20px' }}>LexiKor</Text>
                </div>
                <Paragraph className="text-secondary" style={{ marginBottom: 0 }}>
                  AI 기반 법률 어시스턴트 플랫폼
                  <br />
                  법률 업무의 미래를 만들어갑니다
                </Paragraph>
              </Space>
            </Col>
            <Col xs={24} md={16}>
              <Row gutter={32}>
                <Col xs={12} sm={6}>
                  <Space direction="vertical" size="small">
                    <Text className="text-primary" strong>제품</Text>
                    <a href="/faq" className="text-secondary">FAQ</a>
                    <a href="/help" className="text-secondary">도움말</a>
                    <a href="/api-docs" className="text-secondary">API</a>
                  </Space>
                </Col>
                <Col xs={12} sm={6}>
                  <Space direction="vertical" size="small">
                    <Text className="text-primary" strong>회사</Text>
                    <a href="/privacy" className="text-secondary">개인정보처리방침</a>
                    <a href="/terms" className="text-secondary">이용약관</a>
                  </Space>
                </Col>
                <Col xs={12} sm={6}>
                  <Space direction="vertical" size="small">
                    <Text className="text-primary" strong>지원</Text>
                    <a href="mailto:support@lexikor.ai" className="text-secondary">이메일</a>
                    <a href="tel:02-1234-5678" className="text-secondary">전화</a>
                  </Space>
                </Col>
                <Col xs={12} sm={6}>
                  <Space direction="vertical" size="small">
                    <Text className="text-primary" strong>상태</Text>
                    <a href="/service-status" className="text-secondary">서비스 상태</a>
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="border-default" style={{
            marginTop: '32px',
            paddingTop: '32px',
            borderTop: '1px solid'
          }}>
            <Text className="text-tertiary" style={{ fontSize: '14px' }}>
              © 2025 LexiKor. All rights reserved.
            </Text>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
