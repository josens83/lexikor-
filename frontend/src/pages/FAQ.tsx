import { Card, Collapse, Typography, Button, Form, Input, message, Divider, Space, Tag } from 'antd'
import { QuestionCircleOutlined, MailOutlined, PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse
const { TextArea } = Input

const FAQ = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const faqData = [
    {
      category: '서비스 일반',
      questions: [
        {
          q: 'LexiKor는 어떤 서비스인가요?',
          a: 'LexiKor는 AI 기술을 활용한 한국형 법률 플랫폼입니다. GPT-4 기반의 법률 상담, 문서 분석, 판례 검색, 법률 문서 자동 생성 등의 기능을 제공합니다.'
        },
        {
          q: '무료 체험이 가능한가요?',
          a: '네, 회원가입 시 14일 무료 체험을 제공합니다. 무료 체험 기간 동안 월 20회 AI 질의와 3개 문서 분석이 가능합니다.'
        },
        {
          q: 'LexiKor의 법률 정보는 얼마나 정확한가요?',
          a: 'LexiKor는 최신 판례와 법령 데이터를 기반으로 하며, GPT-4 AI 모델을 사용합니다. 다만 AI의 답변은 참고용이며, 중요한 법률 문제는 반드시 전문 변호사와 상담하시기 바랍니다.'
        },
        {
          q: '어떤 법률 분야를 다루나요?',
          a: '민사, 형사, 가사, 행정, 노동, 지적재산권 등 다양한 법률 분야를 지원합니다. 각 분야별로 특화된 AI 모델과 데이터베이스를 제공합니다.'
        }
      ]
    },
    {
      category: '요금 및 결제',
      questions: [
        {
          q: '요금제는 어떻게 되나요?',
          a: 'FREE (무료), Professional (월 99,000원), Enterprise (맞춤형) 세 가지 플랜을 제공합니다. 자세한 내용은 요금제 페이지에서 확인하실 수 있습니다.'
        },
        {
          q: '결제 수단은 무엇이 있나요?',
          a: '신용카드, 체크카드를 통한 결제가 가능합니다. Stripe 안전 결제 시스템을 통해 처리됩니다.'
        },
        {
          q: '환불 정책은 어떻게 되나요?',
          a: '서비스 이용 후 7일 이내 환불 요청 시 전액 환불이 가능합니다. 단, 이미 사용한 쿼리나 문서는 차감 후 환불됩니다.'
        },
        {
          q: '플랜을 중간에 변경할 수 있나요?',
          a: '네, 언제든지 플랜 업그레이드가 가능합니다. 업그레이드 시 남은 기간은 일할 계산되어 다음 결제에 반영됩니다.'
        },
        {
          q: '구독을 취소하면 어떻게 되나요?',
          a: '구독 취소 시 현재 결제 기간이 끝날 때까지는 유료 기능을 사용할 수 있으며, 이후 자동으로 무료 플랜으로 전환됩니다.'
        }
      ]
    },
    {
      category: '기능 사용',
      questions: [
        {
          q: 'AI 채팅은 어떻게 사용하나요?',
          a: '대시보드에서 "AI 채팅 시작" 버튼을 클릭하거나, 좌측 메뉴에서 채팅을 선택하세요. 법률 분야를 선택한 후 질문을 입력하면 AI가 답변해드립니다.'
        },
        {
          q: '문서 업로드는 어떤 형식을 지원하나요?',
          a: 'PDF, DOCX, DOC, HWP, TXT 형식의 문서를 지원합니다. 최대 파일 크기는 50MB입니다.'
        },
        {
          q: '판례 검색은 어떻게 하나요?',
          a: '"법률 검색" 메뉴에서 키워드, 사건번호, 날짜 범위 등으로 검색할 수 있습니다. 대법원 판례 및 주요 하급심 판결을 검색할 수 있습니다.'
        },
        {
          q: '생성된 문서를 다운로드할 수 있나요?',
          a: '네, "문서 템플릿" 메뉴에서 생성한 모든 문서는 DOCX 또는 PDF 형식으로 다운로드 가능합니다.'
        }
      ]
    },
    {
      category: '계정 및 보안',
      questions: [
        {
          q: '이메일 인증은 왜 필요한가요?',
          a: '계정 보안과 서비스 품질 유지를 위해 이메일 인증이 필요합니다. 인증 후 모든 기능을 제한 없이 사용하실 수 있습니다.'
        },
        {
          q: '비밀번호를 잊어버렸어요.',
          a: '로그인 페이지에서 "비밀번호를 잊으셨나요?" 링크를 클릭하여 비밀번호 재설정 이메일을 받으실 수 있습니다.'
        },
        {
          q: '2단계 인증(MFA)을 설정할 수 있나요?',
          a: '네, 설정 페이지의 "보안" 탭에서 2단계 인증을 활성화할 수 있습니다. 계정 보안을 위해 활성화를 권장합니다.'
        },
        {
          q: '내 데이터는 안전한가요?',
          a: '모든 데이터는 암호화되어 저장되며, AWS 보안 서버에 보관됩니다. 개인정보는 절대 제3자와 공유되지 않습니다.'
        },
        {
          q: '회원 탈퇴는 어떻게 하나요?',
          a: '설정 페이지의 "계정" 탭에서 회원 탈퇴를 진행할 수 있습니다. 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.'
        }
      ]
    },
    {
      category: '기술 지원',
      questions: [
        {
          q: '모바일에서도 사용할 수 있나요?',
          a: '네, 웹 브라우저를 통해 모바일에서도 접속 가능합니다. 반응형 디자인으로 모든 기기에서 최적화되어 있습니다.'
        },
        {
          q: '지원하는 브라우저는 무엇인가요?',
          a: 'Chrome, Firefox, Safari, Edge 최신 버전을 지원합니다. 최상의 경험을 위해 최신 버전 사용을 권장합니다.'
        },
        {
          q: '오류가 발생했어요.',
          a: '페이지를 새로고침하거나 브라우저 캐시를 삭제해보세요. 문제가 지속되면 support@lexikor.ai로 문의해주세요.'
        },
        {
          q: 'API를 제공하나요?',
          a: 'Enterprise 플랜에서 REST API를 제공합니다. API 문서는 대시보드에서 확인하실 수 있습니다.'
        }
      ]
    }
  ]

  const handleSubmit = async (values: any) => {
    setSubmitting(true)
    try {
      // TODO: 실제 API 연동
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('문의가 접수되었습니다. 24시간 내에 답변드리겠습니다.')
      form.resetFields()
    } catch (error) {
      message.error('문의 접수에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f2f5',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Button
          onClick={() => navigate(-1)}
          style={{ marginBottom: 20 }}
        >
          ← 뒤로가기
        </Button>

        <Card style={{ marginBottom: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <QuestionCircleOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Title level={2}>자주 묻는 질문 (FAQ)</Title>
            <Paragraph type="secondary">
              LexiKor 이용에 관해 자주 묻는 질문들을 모았습니다.
            </Paragraph>
          </div>

          {faqData.map((category, idx) => (
            <div key={idx} style={{ marginBottom: 32 }}>
              <Title level={4} style={{ marginBottom: 16 }}>
                <Tag color="blue">{category.category}</Tag>
              </Title>
              <Collapse
                accordion
                bordered={false}
                style={{ background: '#fafafa' }}
              >
                {category.questions.map((item, qIdx) => (
                  <Panel
                    header={<Text strong>{item.q}</Text>}
                    key={`${idx}-${qIdx}`}
                  >
                    <Paragraph style={{ marginBottom: 0 }}>
                      {item.a}
                    </Paragraph>
                  </Panel>
                ))}
              </Collapse>
            </div>
          ))}
        </Card>

        <Card title="문의하기" style={{ marginBottom: 24 }}>
          <Paragraph type="secondary" style={{ marginBottom: 24 }}>
            FAQ에서 답을 찾지 못하셨나요? 아래 양식을 통해 문의하시거나 직접 연락주세요.
          </Paragraph>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="이름"
              rules={[{ required: true, message: '이름을 입력해주세요' }]}
            >
              <Input placeholder="홍길동" />
            </Form.Item>

            <Form.Item
              name="email"
              label="이메일"
              rules={[
                { required: true, message: '이메일을 입력해주세요' },
                { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
              ]}
            >
              <Input placeholder="example@email.com" />
            </Form.Item>

            <Form.Item
              name="category"
              label="문의 유형"
              rules={[{ required: true, message: '문의 유형을 선택해주세요' }]}
            >
              <Input placeholder="예: 결제 문의, 기능 문의, 버그 신고 등" />
            </Form.Item>

            <Form.Item
              name="message"
              label="문의 내용"
              rules={[{ required: true, message: '문의 내용을 입력해주세요' }]}
            >
              <TextArea
                rows={6}
                placeholder="문의 내용을 상세히 작성해주세요"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                block
                size="large"
              >
                문의하기
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="고객 지원">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Space>
                <MailOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                <div>
                  <Text strong>이메일</Text>
                  <br />
                  <Text copyable>support@lexikor.ai</Text>
                </div>
              </Space>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Space>
                <PhoneOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                <div>
                  <Text strong>전화</Text>
                  <br />
                  <Text copyable>02-1234-5678</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    평일 09:00 - 18:00 (주말 및 공휴일 제외)
                  </Text>
                </div>
              </Space>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Space>
                <ClockCircleOutlined style={{ fontSize: 20, color: '#faad14' }} />
                <div>
                  <Text strong>응답 시간</Text>
                  <br />
                  <Text>평균 24시간 이내</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    긴급 문의는 전화로 연락주세요
                  </Text>
                </div>
              </Space>
            </div>
          </Space>
        </Card>

        <div style={{
          marginTop: 24,
          padding: 20,
          background: '#fff',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <Paragraph type="secondary">
            더 많은 정보가 필요하신가요?{' '}
            <a onClick={() => navigate('/terms')}>이용약관</a>과{' '}
            <a onClick={() => navigate('/privacy')}>개인정보처리방침</a>을 확인해보세요.
          </Paragraph>
        </div>
      </div>
    </div>
  )
}

export default FAQ
