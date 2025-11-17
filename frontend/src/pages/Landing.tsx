import { Layout, Button, Row, Col, Card, Typography, Statistic, Space, Divider } from 'antd'
import { RocketOutlined, SafetyOutlined, ThunderboltOutlined, TeamOutlined, CheckCircleOutlined, StarFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Header, Content, Footer } = Layout
const { Title, Paragraph, Text } = Typography

const Landing = () => {
  const navigate = useNavigate()

  return (
    <Layout>
      <Header style={{ background: '#fff', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000 }}>
        <Row justify="space-between" align="middle" style={{ height: '64px' }}>
          <Col>
            <Title level={3} style={{ margin: 0, color: '#1890ff', cursor: 'pointer' }} onClick={() => navigate('/')}>
              ⚖️ LexiKor
            </Title>
          </Col>
          <Col>
            <Space size="middle">
              <Button type="text" onClick={() => navigate('/faq')}>
                FAQ
              </Button>
              <Button type="text" onClick={() => navigate('/login')}>
                로그인
              </Button>
              <Button type="primary" onClick={() => navigate('/register')}>
                무료 시작하기
              </Button>
            </Space>
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

        {/* Stats Section */}
        <div style={{ padding: '60px 50px', background: '#fff' }}>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={8}>
              <Statistic
                title="활성 사용자"
                value={1200}
                suffix="+"
                valueStyle={{ color: '#1890ff', textAlign: 'center' }}
                style={{ textAlign: 'center' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="처리된 문서"
                value={15000}
                suffix="+"
                valueStyle={{ color: '#52c41a', textAlign: 'center' }}
                style={{ textAlign: 'center' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="고객 만족도"
                value={98}
                suffix="%"
                valueStyle={{ color: '#faad14', textAlign: 'center' }}
                style={{ textAlign: 'center' }}
              />
            </Col>
          </Row>
        </div>

        {/* Testimonials Section */}
        <div style={{ padding: '80px 50px', background: '#f0f2f5' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '60px' }}>
            고객 후기
          </Title>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={8}>
              <Card>
                <div style={{ marginBottom: 16 }}>
                  {[...Array(5)].map((_, i) => (
                    <StarFilled key={i} style={{ color: '#faad14', fontSize: 16 }} />
                  ))}
                </div>
                <Paragraph>
                  "계약서 검토 시간이 70% 단축되었습니다. 놓칠 뻔한 중요 조항도 AI가 찾아줘서 큰 도움이 됩니다."
                </Paragraph>
                <Text strong>- 김변호사, 법무법인</Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <div style={{ marginBottom: 16 }}>
                  {[...Array(5)].map((_, i) => (
                    <StarFilled key={i} style={{ color: '#faad14', fontSize: 16 }} />
                  ))}
                </div>
                <Paragraph>
                  "판례 검색이 정말 빠르고 정확합니다. 예전에는 하루 걸리던 리서치가 1시간이면 끝나요."
                </Paragraph>
                <Text strong>- 이대표, 스타트업</Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <div style={{ marginBottom: 16 }}>
                  {[...Array(5)].map((_, i) => (
                    <StarFilled key={i} style={{ color: '#faad14', fontSize: 16 }} />
                  ))}
                </div>
                <Paragraph>
                  "문서 자동 생성 기능으로 반복 업무를 대폭 줄였습니다. 이제는 필수 툴이 되었어요."
                </Paragraph>
                <Text strong>- 박팀장, 기업 법무팀</Text>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Pricing Section */}
        <div style={{ padding: '80px 50px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '16px' }}>
            합리적인 가격 정책
          </Title>
          <Paragraph style={{ textAlign: 'center', fontSize: 16, marginBottom: 60, color: '#8c8c8c' }}>
            모든 플랜은 14일 무료 체험이 포함되어 있습니다
          </Paragraph>
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

        {/* FAQ Teaser */}
        <div style={{ padding: '60px 50px', background: '#f0f2f5', textAlign: 'center' }}>
          <Title level={3} style={{ marginBottom: 24 }}>
            자주 묻는 질문
          </Title>
          <Space direction="vertical" size="middle" style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
            <Card>
              <Row justify="space-between" align="middle">
                <Col><Text strong>LexiKor는 무료로 사용할 수 있나요?</Text></Col>
                <Col><CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} /></Col>
              </Row>
            </Card>
            <Card>
              <Row justify="space-between" align="middle">
                <Col><Text strong>법률 정보는 얼마나 정확한가요?</Text></Col>
                <Col><CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} /></Col>
              </Row>
            </Card>
            <Card>
              <Row justify="space-between" align="middle">
                <Col><Text strong>환불 정책은 어떻게 되나요?</Text></Col>
                <Col><CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} /></Col>
              </Row>
            </Card>
          </Space>
          <Button
            type="link"
            size="large"
            onClick={() => navigate('/faq')}
            style={{ marginTop: 24 }}
          >
            모든 FAQ 보기 →
          </Button>
        </div>

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px 50px',
          textAlign: 'center'
        }}>
          <Title level={2} style={{ color: '#fff', marginBottom: '24px' }}>
            지금 바로 시작하세요
          </Title>
          <Paragraph style={{ color: '#fff', fontSize: '18px', marginBottom: '32px' }}>
            14일 무료 체험, 신용카드 불필요
          </Paragraph>
          <Space size="middle">
            <Button
              size="large"
              onClick={() => navigate('/register')}
              style={{
                height: '50px',
                fontSize: '18px',
                padding: '0 40px',
                background: '#fff',
                color: '#667eea',
                border: 'none',
                fontWeight: 'bold'
              }}
            >
              무료로 시작하기
            </Button>
            <Button
              size="large"
              onClick={() => navigate('/faq')}
              style={{
                height: '50px',
                fontSize: '18px',
                padding: '0 40px',
                background: 'transparent',
                color: '#fff',
                border: '2px solid #fff'
              }}
            >
              더 알아보기
            </Button>
          </Space>
        </div>
      </Content>

      <Footer style={{ background: '#001529', color: '#fff', padding: '40px 50px' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: '#fff' }}>제품</Title>
            <Space direction="vertical">
              <Button type="link" style={{ color: '#fff', padding: 0 }} onClick={() => navigate('/register')}>
                가격
              </Button>
              <Button type="link" style={{ color: '#fff', padding: 0 }} onClick={() => navigate('/faq')}>
                FAQ
              </Button>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: '#fff' }}>법적 고지</Title>
            <Space direction="vertical">
              <Button type="link" style={{ color: '#fff', padding: 0 }} onClick={() => navigate('/terms')}>
                이용약관
              </Button>
              <Button type="link" style={{ color: '#fff', padding: 0 }} onClick={() => navigate('/privacy')}>
                개인정보처리방침
              </Button>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: '#fff' }}>고객 지원</Title>
            <Space direction="vertical">
              <Text style={{ color: '#fff' }}>support@lexikor.ai</Text>
              <Text style={{ color: '#fff' }}>02-1234-5678</Text>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: '#fff' }}>회사</Title>
            <Space direction="vertical">
              <Text style={{ color: '#fff' }}>서울시 강남구</Text>
              <Text style={{ color: '#fff' }}>사업자번호: 123-45-67890</Text>
            </Space>
          </Col>
        </Row>
        <Divider style={{ background: '#595959', margin: '32px 0' }} />
        <Paragraph style={{ color: '#8c8c8c', margin: 0, textAlign: 'center' }}>
          © 2024 LexiKor. All rights reserved. Made with ❤️ for Korean Legal Professionals
        </Paragraph>
      </Footer>
    </Layout>
  )
}

export default Landing
