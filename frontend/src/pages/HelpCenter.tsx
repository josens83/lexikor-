/**
 * Help Center / Knowledge Base
 *
 * Comprehensive help center with guides, tutorials, and troubleshooting
 * Similar to Zendesk Help Center, Intercom Articles, Notion Help
 */

import { useState } from 'react'
import {
  Card,
  Input,
  Typography,
  Space,
  Row,
  Col,
  Collapse,
  Tag,
  Button,
  Divider,
  List,
  Avatar,
  Breadcrumb,
  Alert
} from 'antd'
import {
  SearchOutlined,
  BookOutlined,
  RocketOutlined,
  ToolOutlined,
  SafetyOutlined,
  DollarOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  MessageOutlined,
  FormOutlined,
  VideoCameraOutlined,
  HomeOutlined,
  RightOutlined
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography
const { Search } = Input
const { Panel } = Collapse

interface Article {
  id: string
  title: string
  category: string
  views: number
  helpful: number
  icon: React.ReactNode
  content: string
}

interface Category {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  articleCount: number
}

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Categories
  const categories: Category[] = [
    {
      id: 'getting-started',
      title: '시작하기',
      description: 'LexiKor를 처음 사용하시나요? 여기서 시작하세요',
      icon: <RocketOutlined style={{ fontSize: 32 }} />,
      color: '#1890ff',
      articleCount: 8
    },
    {
      id: 'features',
      title: '기능 가이드',
      description: 'LexiKor의 주요 기능 사용법',
      icon: <ToolOutlined style={{ fontSize: 32 }} />,
      color: '#52c41a',
      articleCount: 15
    },
    {
      id: 'billing',
      title: '결제 & 구독',
      description: '요금제, 결제, 환불 관련 정보',
      icon: <DollarOutlined style={{ fontSize: 32 }} />,
      color: '#faad14',
      articleCount: 6
    },
    {
      id: 'security',
      title: '보안 & 개인정보',
      description: '데이터 보안 및 개인정보 보호',
      icon: <SafetyOutlined style={{ fontSize: 32 }} />,
      color: '#722ed1',
      articleCount: 5
    },
    {
      id: 'api',
      title: 'API & 개발자',
      description: 'API 통합 및 개발자 리소스',
      icon: <BookOutlined style={{ fontSize: 32 }} />,
      color: '#13c2c2',
      articleCount: 12
    },
    {
      id: 'troubleshooting',
      title: '문제 해결',
      description: '자주 발생하는 문제와 해결 방법',
      icon: <QuestionCircleOutlined style={{ fontSize: 32 }} />,
      color: '#ff4d4f',
      articleCount: 10
    }
  ]

  // Popular articles
  const popularArticles: Article[] = [
    {
      id: '1',
      title: 'LexiKor 시작하기: 첫 계약서 분석',
      category: 'getting-started',
      views: 12453,
      helpful: 1024,
      icon: <RocketOutlined />,
      content: '첫 계약서를 분석하는 방법을 단계별로 안내합니다.'
    },
    {
      id: '2',
      title: 'AI 채팅으로 법률 자문 받기',
      category: 'features',
      views: 9876,
      helpful: 892,
      icon: <MessageOutlined />,
      content: 'AI 법률 상담 채팅 기능 사용 가이드'
    },
    {
      id: '3',
      title: '문서 템플릿 생성 및 사용',
      category: 'features',
      views: 8234,
      helpful: 756,
      icon: <FormOutlined />,
      content: '법률 문서 템플릿을 생성하고 활용하는 방법'
    },
    {
      id: '4',
      title: '요금제 업그레이드 방법',
      category: 'billing',
      views: 7123,
      helpful: 645,
      icon: <DollarOutlined />,
      content: '플랜을 업그레이드하고 결제하는 방법'
    },
    {
      id: '5',
      title: 'API 키 발급 및 사용',
      category: 'api',
      views: 6543,
      helpful: 587,
      icon: <BookOutlined />,
      content: 'API 키를 발급받고 사용하는 방법'
    }
  ]

  // FAQ
  const faqs = [
    {
      category: '일반',
      questions: [
        {
          q: 'LexiKor는 어떤 서비스인가요?',
          a: 'LexiKor는 AI 기반 법률 서비스 플랫폼으로, 계약서 분석, 법률 상담, 문서 생성 등의 기능을 제공합니다.'
        },
        {
          q: '무료로 사용할 수 있나요?',
          a: '네, Free 플랜으로 기본 기능을 무료로 사용하실 수 있습니다. 더 많은 기능이 필요하시면 Professional 또는 Enterprise 플랜으로 업그레이드하세요.'
        },
        {
          q: '어떤 종류의 법률 문서를 분석할 수 있나요?',
          a: '계약서, 약관, 고용 계약서, NDA, 파트너십 계약서 등 대부분의 법률 문서를 분석할 수 있습니다.'
        }
      ]
    },
    {
      category: '기능',
      questions: [
        {
          q: 'AI 채팅은 어떻게 작동하나요?',
          a: 'GPT-4 기반 AI가 법률 전문 지식으로 훈련되어 법률 질문에 답변하고 조언을 제공합니다.'
        },
        {
          q: '문서 업로드 형식은 무엇을 지원하나요?',
          a: 'PDF, DOCX, TXT 형식을 지원하며, 최대 10MB까지 업로드할 수 있습니다.'
        },
        {
          q: '분석 결과를 저장할 수 있나요?',
          a: '네, 모든 분석 결과는 자동으로 저장되며 대시보드에서 언제든지 확인할 수 있습니다.'
        }
      ]
    },
    {
      category: '결제',
      questions: [
        {
          q: '결제 수단은 무엇을 사용할 수 있나요?',
          a: '신용카드(Visa, MasterCard, AMEX), 체크카드, 계좌이체를 지원합니다.'
        },
        {
          q: '언제든지 취소할 수 있나요?',
          a: '네, 언제든지 구독을 취소할 수 있으며, 현재 결제 기간이 끝날 때까지 서비스를 이용하실 수 있습니다.'
        },
        {
          q: '환불 정책은 어떻게 되나요?',
          a: '14일 환불 보장 정책을 제공합니다. 서비스가 만족스럽지 않으시면 전액 환불해드립니다.'
        }
      ]
    },
    {
      category: '보안',
      questions: [
        {
          q: '업로드한 문서는 안전한가요?',
          a: '네, 모든 문서는 암호화되어 저장되며, 엄격한 보안 정책에 따라 관리됩니다.'
        },
        {
          q: '내 데이터를 AI 학습에 사용하나요?',
          a: '아니요, 고객님의 데이터는 절대 AI 학습에 사용되지 않습니다. 개인정보 보호를 최우선으로 합니다.'
        },
        {
          q: 'GDPR 준수하나요?',
          a: '네, LexiKor는 GDPR 및 한국 개인정보보호법을 준수합니다.'
        }
      ]
    }
  ]

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    // TODO: Implement search functionality
  }

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 48,
          padding: '60px 24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 16,
          color: '#fff'
        }}>
          <Title level={1} style={{ color: '#fff', marginBottom: 16 }}>
            무엇을 도와드릴까요?
          </Title>
          <Search
            placeholder="질문을 입력하세요 (예: 계약서 분석 방법)"
            size="large"
            prefix={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ maxWidth: 600, margin: '0 auto' }}
            enterButton="검색"
          />
          <div style={{ marginTop: 24 }}>
            <Space wrap>
              <Tag color="rgba(255,255,255,0.2)" style={{ padding: '4px 12px', cursor: 'pointer' }}>
                계약서 분석
              </Tag>
              <Tag color="rgba(255,255,255,0.2)" style={{ padding: '4px 12px', cursor: 'pointer' }}>
                AI 채팅 사용법
              </Tag>
              <Tag color="rgba(255,255,255,0.2)" style={{ padding: '4px 12px', cursor: 'pointer' }}>
                요금제 변경
              </Tag>
              <Tag color="rgba(255,255,255,0.2)" style={{ padding: '4px 12px', cursor: 'pointer' }}>
                API 문서
              </Tag>
            </Space>
          </div>
        </div>

        {/* Breadcrumb */}
        {selectedCategory && (
          <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item>
              <a onClick={() => setSelectedCategory(null)}>
                <HomeOutlined /> 도움말 센터
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {categories.find(c => c.id === selectedCategory)?.title}
            </Breadcrumb.Item>
          </Breadcrumb>
        )}

        {/* Categories */}
        {!selectedCategory && (
          <>
            <Title level={3} style={{ marginBottom: 24 }}>
              카테고리별 도움말
            </Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
              {categories.map((category) => (
                <Col xs={24} sm={12} lg={8} key={category.id}>
                  <Card
                    hoverable
                    onClick={() => setSelectedCategory(category.id)}
                    style={{ height: '100%' }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ color: category.color }}>
                        {category.icon}
                      </div>
                      <Title level={4} style={{ marginBottom: 8 }}>
                        {category.title}
                      </Title>
                      <Text type="secondary">{category.description}</Text>
                      <Divider style={{ margin: '12px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {category.articleCount}개 문서
                        </Text>
                        <RightOutlined style={{ color: category.color }} />
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* Popular Articles */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileTextOutlined />
              <span>인기 있는 문서</span>
            </div>
          }
          style={{ marginBottom: 24 }}
        >
          <List
            itemLayout="horizontal"
            dataSource={popularArticles}
            renderItem={(article) => (
              <List.Item
                style={{ cursor: 'pointer', padding: '16px' }}
                actions={[
                  <Space key="views">
                    <Text type="secondary">{article.views.toLocaleString()} 조회</Text>
                  </Space>,
                  <Space key="helpful">
                    <Text type="secondary">{article.helpful} 도움됨</Text>
                  </Space>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{
                        background: categories.find(c => c.id === article.category)?.color
                      }}
                      icon={article.icon}
                    />
                  }
                  title={<Text strong>{article.title}</Text>}
                  description={article.content}
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Video Tutorials */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <VideoCameraOutlined />
              <span>비디오 튜토리얼</span>
            </div>
          }
          style={{ marginBottom: 24 }}
        >
          <Row gutter={[16, 16]}>
            {[
              { title: 'LexiKor 시작하기 (5분)', duration: '5:23' },
              { title: 'AI 채팅 완벽 가이드', duration: '8:45' },
              { title: '계약서 분석 마스터하기', duration: '12:30' }
            ].map((video, index) => (
              <Col xs={24} sm={8} key={index}>
                <Card
                  hoverable
                  cover={
                    <div style={{
                      height: 160,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <VideoCameraOutlined style={{ fontSize: 48, color: '#fff' }} />
                    </div>
                  }
                >
                  <Card.Meta
                    title={video.title}
                    description={
                      <Tag color="blue">{video.duration}</Tag>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* FAQ */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <QuestionCircleOutlined />
              <span>자주 묻는 질문 (FAQ)</span>
            </div>
          }
        >
          <Collapse accordion>
            {faqs.map((section, sectionIndex) => (
              <Panel header={<Text strong>{section.category}</Text>} key={sectionIndex}>
                <Collapse ghost>
                  {section.questions.map((faq, faqIndex) => (
                    <Panel
                      header={faq.q}
                      key={faqIndex}
                      extra={<QuestionCircleOutlined />}
                    >
                      <Paragraph>{faq.a}</Paragraph>
                    </Panel>
                  ))}
                </Collapse>
              </Panel>
            ))}
          </Collapse>
        </Card>

        {/* Contact Support */}
        <Alert
          message="답을 찾지 못하셨나요?"
          description={
            <div>
              <Paragraph style={{ marginTop: 8 }}>
                저희 지원팀이 도와드리겠습니다. 아래 방법으로 문의하세요:
              </Paragraph>
              <Space>
                <Button type="primary" icon={<MessageOutlined />}>
                  채팅 상담
                </Button>
                <Button icon={<MessageOutlined />} href="mailto:support@lexikor.ai">
                  이메일 보내기
                </Button>
                <Button href="tel:02-1234-5678">
                  전화: 02-1234-5678
                </Button>
              </Space>
            </div>
          }
          type="info"
          showIcon
          style={{ marginTop: 24 }}
        />
      </div>
    </div>
  )
}

export default HelpCenter
