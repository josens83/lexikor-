import { useState, useEffect } from 'react'
import { Card, Row, Col, List, Typography, Input, Button, Form, Select, Space, Modal, message, Tabs, Badge } from 'antd'
import { FileTextOutlined, CopyOutlined, DownloadOutlined, FormOutlined } from '@ant-design/icons'
import { templatesAPI } from '../services/api'
import type { TabsProps } from 'antd'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

interface Template {
  id: string
  name: string
  description: string
  category: string
  variables: string[]
}

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [previewContent, setPreviewContent] = useState<string>('')
  const [generating, setGenerating] = useState(false)
  const [activeCategory, setActiveCategory] = useState('lawsuit')
  const [form] = Form.useForm()

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setLoading(true)
    try {
      const response = await templatesAPI.getTemplates()
      setTemplates(response.data)
    } catch (error) {
      message.error('템플릿 목록을 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateSelect = async (template: Template) => {
    setSelectedTemplate(template)
    setPreviewContent('')
    form.resetFields()

    // Load template info
    try {
      const [templateType, templateSubtype] = template.id.split('.')
      const response = await templatesAPI.getTemplate(templateType, templateSubtype)
      // Could show sample content if needed
    } catch (error) {
      console.error('Failed to load template info:', error)
    }
  }

  const handleGenerate = async (values: any) => {
    if (!selectedTemplate) return

    setGenerating(true)
    try {
      const [templateType, templateSubtype] = selectedTemplate.id.split('.')

      const response = await templatesAPI.generateDocument({
        template_type: templateType,
        template_subtype: templateSubtype,
        variables: values
      })

      setPreviewContent(response.data.content)
      message.success('문서가 생성되었습니다')
    } catch (error: any) {
      message.error(error.response?.data?.detail || '문서 생성에 실패했습니다')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    if (previewContent) {
      navigator.clipboard.writeText(previewContent)
      message.success('클립보드에 복사되었습니다')
    }
  }

  const handleDownload = () => {
    if (!previewContent || !selectedTemplate) return

    const blob = new Blob([previewContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedTemplate.name}_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    message.success('문서가 다운로드되었습니다')
  }

  const categoryLabels: Record<string, string> = {
    lawsuit: '소송',
    contract: '계약',
    notice: '통지',
    opinion: '의견서'
  }

  const categoryIcons: Record<string, string> = {
    lawsuit: '⚖️',
    contract: '📝',
    notice: '📬',
    opinion: '📋'
  }

  const filteredTemplates = templates.filter(t => t.category === activeCategory)

  const tabItems: TabsProps['items'] = Object.keys(categoryLabels).map(key => ({
    key,
    label: (
      <span>
        <span style={{ marginRight: '8px' }}>{categoryIcons[key]}</span>
        {categoryLabels[key]}
        <Badge
          count={templates.filter(t => t.category === key).length}
          style={{ marginLeft: '8px', backgroundColor: '#52c41a' }}
        />
      </span>
    )
  }))

  const getFieldLabel = (variable: string): string => {
    const labels: Record<string, string> = {
      plaintiff: '원고',
      defendant: '피고',
      claim_amount: '청구금액',
      facts: '청구원인 (사실관계)',
      legal_grounds: '법적 근거',
      evidence: '입증방법',
      attachments: '첨부서류',
      date: '작성일',
      court: '법원명',
      complainant: '고소인',
      accused: '피고소인',
      crime: '범죄명',
      police_station: '경찰서',
      lessor: '임대인',
      lessee: '임차인',
      property: '목적물 (부동산 정보)',
      deposit: '보증금',
      rent: '월세',
      period: '임대차 기간',
      contract_deposit: '계약금',
      payment_schedule: '중도금 및 잔금 지급 일정',
      termination_clause: '계약 해지 조항',
      creditor: '채권자',
      debtor: '채무자',
      amount: '채무금액',
      due_date: '변제기일',
      creditor_address: '채권자 주소',
      creditor_phone: '채권자 연락처',
      client: '의뢰인',
      matter: '사안',
      question: '질의사항',
      analysis: '검토의견',
      conclusion: '결론',
      statutes: '관련 법령',
      cases: '관련 판례',
      lawyer: '작성자 (변호사)',
      law_firm: '소속 (법무법인)'
    }
    return labels[variable] || variable
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: 1600, margin: '0 auto' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Title level={2}>문서 템플릿</Title>
              <Paragraph type="secondary">
                법률 문서 템플릿을 선택하고 필요한 정보를 입력하여 자동으로 문서를 생성하세요.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          {/* Left: Template List */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <FileTextOutlined style={{ color: '#1890ff' }} />
                  <Text strong>템플릿 목록</Text>
                </Space>
              }
            >
              <Tabs
                activeKey={activeCategory}
                items={tabItems}
                onChange={setActiveCategory}
                tabPosition="top"
              />

              <List
                loading={loading}
                dataSource={filteredTemplates}
                renderItem={(template) => (
                  <List.Item
                    style={{
                      cursor: 'pointer',
                      background: selectedTemplate?.id === template.id ? '#e6f7ff' : 'transparent',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      border: selectedTemplate?.id === template.id ? '2px solid #1890ff' : '1px solid #f0f0f0'
                    }}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <List.Item.Meta
                      avatar={<FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                      title={<Text strong>{template.name}</Text>}
                      description={
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {template.description}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            입력 항목: {template.variables.length}개
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Middle: Form */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <FormOutlined style={{ color: '#52c41a' }} />
                  <Text strong>정보 입력</Text>
                </Space>
              }
            >
              {selectedTemplate ? (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleGenerate}
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                      <Text strong>{selectedTemplate.name}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {selectedTemplate.description}
                      </Text>
                    </div>

                    {selectedTemplate.variables.map((variable) => (
                      <Form.Item
                        key={variable}
                        name={variable}
                        label={getFieldLabel(variable)}
                        rules={[{ required: true, message: `${getFieldLabel(variable)}을(를) 입력하세요` }]}
                      >
                        {['facts', 'legal_grounds', 'evidence', 'attachments', 'payment_schedule',
                          'termination_clause', 'question', 'analysis', 'conclusion', 'statutes',
                          'cases', 'property'].includes(variable) ? (
                          <TextArea
                            rows={4}
                            placeholder={`${getFieldLabel(variable)}을(를) 입력하세요`}
                          />
                        ) : variable === 'date' ? (
                          <Input
                            type="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                          />
                        ) : variable.includes('amount') || variable.includes('deposit') || variable.includes('rent') ? (
                          <Input
                            type="number"
                            suffix="원"
                            placeholder="금액을 입력하세요"
                          />
                        ) : (
                          <Input placeholder={`${getFieldLabel(variable)}을(를) 입력하세요`} />
                        )}
                      </Form.Item>
                    ))}

                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={generating}
                      block
                      size="large"
                      icon={<FileTextOutlined />}
                    >
                      문서 생성
                    </Button>
                  </Space>
                </Form>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                  <Paragraph type="secondary" style={{ marginTop: '16px' }}>
                    왼쪽 목록에서 템플릿을 선택하세요
                  </Paragraph>
                </div>
              )}
            </Card>
          </Col>

          {/* Right: Preview */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <FileTextOutlined style={{ color: '#722ed1' }} />
                  <Text strong>문서 미리보기</Text>
                </Space>
              }
              extra={
                previewContent && (
                  <Space>
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={handleCopy}
                    >
                      복사
                    </Button>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={handleDownload}
                    >
                      다운로드
                    </Button>
                  </Space>
                )
              }
            >
              {previewContent ? (
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    padding: '16px',
                    background: '#fafafa',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    maxHeight: '600px',
                    overflowY: 'auto'
                  }}
                >
                  {previewContent}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                  <Paragraph type="secondary" style={{ marginTop: '16px' }}>
                    정보를 입력하고 '문서 생성'을 클릭하면<br />
                    생성된 문서가 여기에 표시됩니다
                  </Paragraph>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Templates
