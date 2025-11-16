import { Layout, Button, Row, Col, Card, Typography } from 'antd'
import { RocketOutlined, SafetyOutlined, ThunderboltOutlined, TeamOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Header, Content, Footer } = Layout
const { Title, Paragraph } = Typography

const Landing = () => {
  const navigate = useNavigate()

  return (
    <Layout>
      <Header style={{ background: '#fff', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Row justify="space-between" align="middle" style={{ height: '64px' }}>
          <Col>
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>LexiKor</Title>
          </Col>
          <Col>
            <Button type="text" onClick={() => navigate('/login')} style={{ marginRight: 16 }}>
              로그인
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              무료 시작하기
            </Button>
          </Col>
        </Row>
      </Header>

      <Content>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '100px 50px',
          textAlign: 'center',
          color: '#fff'
        }}>
          <Title style={{ color: '#fff', fontSize: '48px', marginBottom: '24px' }}>
            AI 기반 법률 어시스턴트
          </Title>
          <Paragraph style={{ color: '#fff', fontSize: '20px', marginBottom: '40px' }}>
            판례 검색, 계약서 분석, 법률 문서 작성을 AI로 자동화하세요
          </Paragraph>
          <Button type="primary" size="large" onClick={() => navigate('/register')} style={{
            height: '50px',
            fontSize: '18px',
            padding: '0 40px'
          }}>
            14일 무료 체험 시작
          </Button>
        </div>

        {/* Features Section */}
        <div style={{ padding: '80px 50px', background: '#f0f2f5' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '60px' }}>
            왜 LexiKor를 선택해야 할까요?
          </Title>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ textAlign: 'center', height: '100%' }}>
                <RocketOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '20px' }} />
                <Title level={4}>빠른 법률 검색</Title>
                <Paragraph>
                  수천 건의 판례와 법령을 AI가 즉시 검색하여 관련 정보를 제공합니다
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ textAlign: 'center', height: '100%' }}>
                <SafetyOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '20px' }} />
                <Title level={4}>계약서 자동 분석</Title>
                <Paragraph>
                  계약서의 위험 조항을 자동으로 식별하고 수정 제안을 제공합니다
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ textAlign: 'center', height: '100%' }}>
                <ThunderboltOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '20px' }} />
                <Title level={4}>문서 자동 생성</Title>
                <Paragraph>
                  소장, 내용증명, 계약서 등 법률 문서를 템플릿으로 빠르게 작성합니다
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ textAlign: 'center', height: '100%' }}>
                <TeamOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '20px' }} />
                <Title level={4}>팀 협업</Title>
                <Paragraph>
                  법률사무소 전체가 함께 사용하며 문서와 정보를 공유할 수 있습니다
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Pricing Section */}
        <div style={{ padding: '80px 50px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '60px' }}>
            합리적인 가격 정책
          </Title>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={8}>
              <Card className="pricing-card">
                <Title level={4}>Free</Title>
                <div className="price">무료</div>
                <Paragraph>개인 사용자를 위한 무료 플랜</Paragraph>
                <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
                  <li>월 20회 AI 쿼리</li>
                  <li>문서 5개 저장</li>
                  <li>기본 채팅 기능</li>
                  <li>문서 요약</li>
                </ul>
                <Button size="large" block onClick={() => navigate('/register')}>
                  시작하기
                </Button>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="pricing-card featured">
                <Title level={4}>Professional</Title>
                <div className="price">₩99,000<span style={{ fontSize: '16px' }}>/월</span></div>
                <Paragraph>전문가를 위한 프로 플랜</Paragraph>
                <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
                  <li>무제한 AI 쿼리</li>
                  <li>문서 100개 저장</li>
                  <li>전체 기능 사용</li>
                  <li>우선 지원</li>
                </ul>
                <Button type="primary" size="large" block onClick={() => navigate('/register')}>
                  지금 시작
                </Button>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="pricing-card">
                <Title level={4}>Enterprise</Title>
                <div className="price">맞춤 견적</div>
                <Paragraph>법률사무소를 위한 엔터프라이즈</Paragraph>
                <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
                  <li>무제한 쿼리 & 문서</li>
                  <li>전용 서버</li>
                  <li>API 액세스</li>
                  <li>커스터마이징</li>
                </ul>
                <Button size="large" block>
                  문의하기
                </Button>
              </Card>
            </Col>
          </Row>
        </div>

        {/* CTA Section */}
        <div style={{
          background: '#1890ff',
          padding: '60px 50px',
          textAlign: 'center'
        }}>
          <Title level={2} style={{ color: '#fff', marginBottom: '24px' }}>
            지금 바로 시작하세요
          </Title>
          <Paragraph style={{ color: '#fff', fontSize: '18px', marginBottom: '32px' }}>
            14일 무료 체험, 신용카드 불필요
          </Paragraph>
          <Button
            size="large"
            onClick={() => navigate('/register')}
            style={{ height: '50px', fontSize: '18px', padding: '0 40px' }}
          >
            무료로 시작하기
          </Button>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff' }}>
        <Paragraph style={{ color: '#fff', margin: 0 }}>
          LexiKor ©2024 Created with ❤️ for Korean Legal Professionals
        </Paragraph>
      </Footer>
    </Layout>
  )
}

export default Landing
