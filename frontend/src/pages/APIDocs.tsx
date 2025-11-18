/**
 * API Documentation Portal
 *
 * Comprehensive API documentation for developers
 * Similar to Stripe API Docs, GitHub API Docs, Twilio Docs
 */

import { useState } from 'react'
import {
  Card,
  Typography,
  Tabs,
  Space,
  Tag,
  Button,
  Input,
  Collapse,
  Table,
  Alert,
  Divider,
  message,
  Row,
  Col,
  Select
} from 'antd'
import {
  ApiOutlined,
  CodeOutlined,
  KeyOutlined,
  BookOutlined,
  RocketOutlined,
  CopyOutlined,
  CheckOutlined,
  ThunderboltOutlined,
  SafetyOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Panel } = Collapse
const { Option } = Select

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description: string
  auth_required: boolean
  rate_limit: string
}

interface APIParameter {
  name: string
  type: string
  required: boolean
  description: string
  example?: string
}

const APIDocs = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedLanguage, setSelectedLanguage] = useState('curl')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Mock API key
  const apiKey = 'sk_live_xxxxxxxxxxxxxxxxxxxx'

  // API Endpoints
  const endpoints: APIEndpoint[] = [
    {
      method: 'POST',
      path: '/api/v1/chat/completions',
      description: 'AI 법률 상담 채팅 생성',
      auth_required: true,
      rate_limit: '100 requests/min'
    },
    {
      method: 'GET',
      path: '/api/v1/chat/conversations',
      description: '채팅 대화 목록 조회',
      auth_required: true,
      rate_limit: '1000 requests/min'
    },
    {
      method: 'POST',
      path: '/api/v1/documents/upload',
      description: '문서 업로드',
      auth_required: true,
      rate_limit: '50 requests/min'
    },
    {
      method: 'POST',
      path: '/api/v1/documents/analyze',
      description: '문서 분석',
      auth_required: true,
      rate_limit: '100 requests/min'
    },
    {
      method: 'GET',
      path: '/api/v1/templates',
      description: '문서 템플릿 목록 조회',
      auth_required: true,
      rate_limit: '1000 requests/min'
    },
    {
      method: 'POST',
      path: '/api/v1/research/search',
      description: '법률 검색',
      auth_required: true,
      rate_limit: '100 requests/min'
    }
  ]

  const columns: ColumnsType<APIEndpoint> = [
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      render: (method) => {
        const colors: Record<string, string> = {
          GET: 'blue',
          POST: 'green',
          PUT: 'orange',
          DELETE: 'red',
          PATCH: 'purple'
        }
        return <Tag color={colors[method]}>{method}</Tag>
      }
    },
    {
      title: 'Endpoint',
      dataIndex: 'path',
      key: 'path',
      render: (path) => <Text code>{path}</Text>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Auth',
      dataIndex: 'auth_required',
      key: 'auth_required',
      width: 80,
      render: (required) => required ? <Tag color="gold">Required</Tag> : <Tag>Public</Tag>
    },
    {
      title: 'Rate Limit',
      dataIndex: 'rate_limit',
      key: 'rate_limit',
      width: 150
    }
  ]

  const codeExamples = {
    curl: `curl https://api.lexikor.ai/v1/chat/completions \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "계약서 검토가 필요합니다",
    "conversation_id": "conv_123"
  }'`,

    python: `import requests

api_key = "${apiKey}"
url = "https://api.lexikor.ai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

data = {
    "message": "계약서 검토가 필요합니다",
    "conversation_id": "conv_123"
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`,

    javascript: `const apiKey = "${apiKey}";
const url = "https://api.lexikor.ai/v1/chat/completions";

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${apiKey}\`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: "계약서 검토가 필요합니다",
    conversation_id: "conv_123"
  })
});

const data = await response.json();
console.log(data);`,

    java: `import java.net.http.*;
import java.net.URI;

String apiKey = "${apiKey}";
String url = "https://api.lexikor.ai/v1/chat/completions";

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create(url))
    .header("Authorization", "Bearer " + apiKey)
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(
        "{\\"message\\": \\"계약서 검토가 필요합니다\\", \\"conversation_id\\": \\"conv_123\\"}"
    ))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`
  }

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    message.success('코드가 복사되었습니다')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <Title level={1}>
            <ApiOutlined /> LexiKor API 문서
          </Title>
          <Paragraph style={{ fontSize: 16, color: 'rgba(0,0,0,0.65)' }}>
            LexiKor API를 사용하여 법률 AI 서비스를 여러분의 애플리케이션에 통합하세요
          </Paragraph>
          <Space size="large" style={{ marginTop: 16 }}>
            <Button type="primary" size="large" icon={<RocketOutlined />}>
              시작하기
            </Button>
            <Button size="large" icon={<KeyOutlined />}>
              API 키 발급
            </Button>
            <Button size="large" icon={<BookOutlined />}>
              가이드 보기
            </Button>
          </Space>
        </div>

        {/* Main Content */}
        <Card>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'overview',
                label: (
                  <span>
                    <BookOutlined />
                    개요
                  </span>
                ),
                children: (
                  <div>
                    <Title level={3}>API 개요</Title>
                    <Paragraph>
                      LexiKor API는 RESTful API로 설계되었으며, JSON 형식으로 데이터를 주고받습니다.
                      모든 API 요청은 HTTPS를 통해 암호화되며, API 키를 사용한 인증이 필요합니다.
                    </Paragraph>

                    <Alert
                      message="Base URL"
                      description={
                        <div>
                          <Text code>https://api.lexikor.ai/v1</Text>
                          <div style={{ marginTop: 8 }}>
                            모든 API 엔드포인트는 위 Base URL을 기준으로 합니다.
                          </div>
                        </div>
                      }
                      type="info"
                      showIcon
                      style={{ marginBottom: 24 }}
                    />

                    <Row gutter={16} style={{ marginBottom: 24 }}>
                      <Col xs={24} md={8}>
                        <Card>
                          <Statistic
                            title="응답 시간"
                            value="< 200ms"
                            prefix={<ThunderboltOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card>
                          <Statistic
                            title="가동률"
                            value="99.9%"
                            prefix={<CheckOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card>
                          <Statistic
                            title="보안"
                            value="TLS 1.3"
                            prefix={<SafetyOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                          />
                        </Card>
                      </Col>
                    </Row>

                    <Title level={4}>주요 기능</Title>
                    <ul style={{ fontSize: 15, lineHeight: '2' }}>
                      <li><strong>AI 법률 상담:</strong> 자연어 기반 법률 질의응답</li>
                      <li><strong>문서 분석:</strong> 계약서, 법률 문서 자동 분석</li>
                      <li><strong>법률 검색:</strong> 판례, 법령, 규정 검색</li>
                      <li><strong>템플릿 생성:</strong> 법률 문서 템플릿 자동 생성</li>
                      <li><strong>실시간 알림:</strong> Webhook을 통한 실시간 이벤트 알림</li>
                    </ul>

                    <Divider />

                    <Title level={4}>인증</Title>
                    <Paragraph>
                      모든 API 요청에는 API 키가 필요합니다. API 키는 HTTP Authorization 헤더에 Bearer 토큰으로 전달합니다.
                    </Paragraph>
                    <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                      <Text code>Authorization: Bearer YOUR_API_KEY</Text>
                    </div>

                    <Alert
                      message="보안 주의사항"
                      description="API 키는 절대 클라이언트 코드나 공개 저장소에 노출하지 마세요. 서버 사이드에서만 사용하세요."
                      type="warning"
                      showIcon
                      style={{ marginTop: 16 }}
                    />
                  </div>
                )
              },
              {
                key: 'endpoints',
                label: (
                  <span>
                    <ApiOutlined />
                    API 엔드포인트
                  </span>
                ),
                children: (
                  <div>
                    <Title level={3}>API 엔드포인트</Title>
                    <Paragraph>
                      LexiKor API가 제공하는 모든 엔드포인트 목록입니다.
                    </Paragraph>

                    <Table
                      columns={columns}
                      dataSource={endpoints}
                      rowKey="path"
                      pagination={false}
                      style={{ marginBottom: 24 }}
                    />

                    <Divider />

                    <Title level={4}>엔드포인트 상세</Title>
                    <Collapse accordion>
                      <Panel
                        header={
                          <div>
                            <Tag color="green">POST</Tag>
                            <Text code>/api/v1/chat/completions</Text>
                          </div>
                        }
                        key="1"
                      >
                        <Title level={5}>AI 법률 상담 채팅</Title>
                        <Paragraph>AI 법률 상담을 위한 채팅 메시지를 전송하고 응답을 받습니다.</Paragraph>

                        <Title level={5} style={{ marginTop: 24 }}>요청 파라미터</Title>
                        <Table
                          size="small"
                          columns={[
                            { title: '이름', dataIndex: 'name', key: 'name' },
                            { title: '타입', dataIndex: 'type', key: 'type', render: (t) => <Text code>{t}</Text> },
                            { title: '필수', dataIndex: 'required', key: 'required', render: (r) => r ? <Tag color="red">필수</Tag> : <Tag>선택</Tag> },
                            { title: '설명', dataIndex: 'description', key: 'description' }
                          ]}
                          dataSource={[
                            { name: 'message', type: 'string', required: true, description: '사용자 메시지' },
                            { name: 'conversation_id', type: 'string', required: false, description: '대화 ID (이어서 대화 시)' },
                            { name: 'context', type: 'object', required: false, description: '추가 컨텍스트 정보' }
                          ]}
                          pagination={false}
                        />

                        <Title level={5} style={{ marginTop: 24 }}>응답 예시</Title>
                        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                          <pre style={{ margin: 0 }}>
{`{
  "id": "msg_abc123",
  "conversation_id": "conv_xyz789",
  "message": "안녕하세요. 계약서 검토를 도와드리겠습니다...",
  "created_at": "2025-11-18T16:45:00Z",
  "usage": {
    "prompt_tokens": 120,
    "completion_tokens": 350,
    "total_tokens": 470
  }
}`}
                          </pre>
                        </div>
                      </Panel>

                      <Panel
                        header={
                          <div>
                            <Tag color="green">POST</Tag>
                            <Text code>/api/v1/documents/upload</Text>
                          </div>
                        }
                        key="2"
                      >
                        <Title level={5}>문서 업로드</Title>
                        <Paragraph>법률 문서를 업로드하여 분석을 준비합니다.</Paragraph>

                        <Alert
                          message="지원 형식"
                          description="PDF, DOCX, TXT 형식의 문서를 지원합니다. 최대 파일 크기는 10MB입니다."
                          type="info"
                          showIcon
                          style={{ marginBottom: 16 }}
                        />
                      </Panel>

                      <Panel
                        header={
                          <div>
                            <Tag color="green">POST</Tag>
                            <Text code>/api/v1/research/search</Text>
                          </div>
                        }
                        key="3"
                      >
                        <Title level={5}>법률 검색</Title>
                        <Paragraph>판례, 법령, 규정 등을 검색합니다.</Paragraph>
                      </Panel>
                    </Collapse>
                  </div>
                )
              },
              {
                key: 'examples',
                label: (
                  <span>
                    <CodeOutlined />
                    코드 예제
                  </span>
                ),
                children: (
                  <div>
                    <Title level={3}>코드 예제</Title>
                    <Paragraph>
                      다양한 프로그래밍 언어로 작성된 LexiKor API 사용 예제입니다.
                    </Paragraph>

                    <Space style={{ marginBottom: 16 }}>
                      <Text strong>언어 선택:</Text>
                      <Select value={selectedLanguage} onChange={setSelectedLanguage} style={{ width: 150 }}>
                        <Option value="curl">cURL</Option>
                        <Option value="python">Python</Option>
                        <Option value="javascript">JavaScript</Option>
                        <Option value="java">Java</Option>
                      </Select>
                    </Space>

                    <Card
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>AI 채팅 API 호출 예제</span>
                          <Button
                            type="text"
                            icon={copiedCode === selectedLanguage ? <CheckOutlined /> : <CopyOutlined />}
                            onClick={() => handleCopyCode(codeExamples[selectedLanguage as keyof typeof codeExamples], selectedLanguage)}
                          >
                            {copiedCode === selectedLanguage ? '복사됨' : '복사'}
                          </Button>
                        </div>
                      }
                    >
                      <pre style={{
                        background: '#1e1e1e',
                        color: '#d4d4d4',
                        padding: 16,
                        borderRadius: 8,
                        overflow: 'auto'
                      }}>
                        {codeExamples[selectedLanguage as keyof typeof codeExamples]}
                      </pre>
                    </Card>

                    <Alert
                      message="SDK 라이브러리"
                      description={
                        <div>
                          <Paragraph>공식 SDK를 사용하면 더 쉽게 API를 사용할 수 있습니다:</Paragraph>
                          <Space direction="vertical">
                            <Text code>pip install lexikor-python</Text>
                            <Text code>npm install @lexikor/sdk</Text>
                            <Text code>gem install lexikor-ruby</Text>
                          </Space>
                        </div>
                      }
                      type="info"
                      showIcon
                      style={{ marginTop: 24 }}
                    />
                  </div>
                )
              },
              {
                key: 'rate-limits',
                label: (
                  <span>
                    <ThunderboltOutlined />
                    속도 제한
                  </span>
                ),
                children: (
                  <div>
                    <Title level={3}>API 속도 제한</Title>
                    <Paragraph>
                      API 남용을 방지하고 모든 사용자에게 공정한 서비스를 제공하기 위해 속도 제한을 적용합니다.
                    </Paragraph>

                    <Table
                      columns={[
                        { title: '플랜', dataIndex: 'plan', key: 'plan', render: (p) => <Tag color="blue">{p}</Tag> },
                        { title: '분당 요청', dataIndex: 'rpm', key: 'rpm' },
                        { title: '일일 요청', dataIndex: 'daily', key: 'daily' },
                        { title: '동시 연결', dataIndex: 'concurrent', key: 'concurrent' }
                      ]}
                      dataSource={[
                        { plan: 'Free', rpm: '100', daily: '10,000', concurrent: '5' },
                        { plan: 'Professional', rpm: '1,000', daily: '100,000', concurrent: '20' },
                        { plan: 'Enterprise', rpm: '10,000', daily: 'Unlimited', concurrent: '100' }
                      ]}
                      pagination={false}
                      style={{ marginBottom: 24 }}
                    />

                    <Alert
                      message="속도 제한 초과"
                      description="속도 제한을 초과하면 HTTP 429 응답을 받게 됩니다. Retry-After 헤더를 확인하여 재시도 시간을 파악하세요."
                      type="warning"
                      showIcon
                    />
                  </div>
                )
              },
              {
                key: 'errors',
                label: (
                  <span>
                    <SafetyOutlined />
                    에러 처리
                  </span>
                ),
                children: (
                  <div>
                    <Title level={3}>에러 코드</Title>
                    <Paragraph>
                      LexiKor API는 표준 HTTP 상태 코드를 사용하여 에러를 나타냅니다.
                    </Paragraph>

                    <Table
                      columns={[
                        { title: '코드', dataIndex: 'code', key: 'code', width: 100, render: (c) => <Tag color="red">{c}</Tag> },
                        { title: '이름', dataIndex: 'name', key: 'name' },
                        { title: '설명', dataIndex: 'description', key: 'description' }
                      ]}
                      dataSource={[
                        { code: '400', name: 'Bad Request', description: '잘못된 요청 형식' },
                        { code: '401', name: 'Unauthorized', description: 'API 키가 유효하지 않음' },
                        { code: '403', name: 'Forbidden', description: '접근 권한 없음' },
                        { code: '404', name: 'Not Found', description: '리소스를 찾을 수 없음' },
                        { code: '429', name: 'Too Many Requests', description: '속도 제한 초과' },
                        { code: '500', name: 'Internal Server Error', description: '서버 내부 오류' },
                        { code: '503', name: 'Service Unavailable', description: '서비스 일시 중단' }
                      ]}
                      pagination={false}
                    />

                    <Divider />

                    <Title level={4}>에러 응답 형식</Title>
                    <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                      <pre style={{ margin: 0 }}>
{`{
  "error": {
    "code": "invalid_request",
    "message": "The 'message' parameter is required",
    "type": "validation_error",
    "param": "message"
  }
}`}
                      </pre>
                    </div>
                  </div>
                )
              }
            ]}
          />
        </Card>

        {/* Footer */}
        <Card style={{ marginTop: 24, textAlign: 'center' }}>
          <Title level={4}>추가 지원이 필요하신가요?</Title>
          <Space size="large">
            <Button type="link" href="/faq">FAQ 보기</Button>
            <Button type="link" href="mailto:api@lexikor.ai">이메일 문의</Button>
            <Button type="link" href="/service-status">서비스 상태</Button>
          </Space>
        </Card>
      </div>
    </div>
  )
}

const Statistic = ({ title, value, prefix, valueStyle }: any) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 32, fontWeight: 500, ...valueStyle }}>
      {prefix} {value}
    </div>
    <div style={{ color: 'rgba(0,0,0,0.45)', marginTop: 8 }}>{title}</div>
  </div>
)

export default APIDocs
