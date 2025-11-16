import { useState } from 'react'
import { Card, Input, Button, Tabs, Table, Tag, Space, Modal, Typography, Row, Col, Select } from 'antd'
import { SearchOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons'
import { researchAPI } from '../services/api'
import type { TabsProps } from 'antd'

const { Title, Text, Paragraph } = Typography
const { Search } = Input

const Research = () => {
  const [loading, setLoading] = useState(false)
  const [cases, setCases] = useState([])
  const [statutes, setStatutes] = useState([])
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('cases')

  // Filters
  const [caseType, setCaseType] = useState<string>()
  const [legalArea, setLegalArea] = useState<string>()
  const [court, setCourt] = useState<string>()
  const [statuteType, setStatuteType] = useState<string>()

  const handleSearchCases = async (value: string) => {
    if (!value.trim()) return

    setLoading(true)
    try {
      const response = await researchAPI.searchCases({
        query: value,
        case_type: caseType,
        legal_area: legalArea,
        court: court,
        limit: 20
      })
      setCases(response.data)
    } catch (error) {
      console.error('Failed to search cases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchStatutes = async (value: string) => {
    if (!value.trim()) return

    setLoading(true)
    try {
      const response = await researchAPI.searchStatutes({
        query: value,
        statute_type: statuteType,
        limit: 20
      })
      setStatutes(response.data)
    } catch (error) {
      console.error('Failed to search statutes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = async (id: number, type: 'case' | 'statute') => {
    try {
      const response = type === 'case'
        ? await researchAPI.getCaseDetail(id)
        : await researchAPI.getStatuteDetail(id)

      setSelectedItem({ ...response.data, type })
      setDetailModalVisible(true)
    } catch (error) {
      console.error('Failed to load detail:', error)
    }
  }

  const caseColumns = [
    {
      title: '사건번호',
      dataIndex: 'case_number',
      key: 'case_number',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: '사건명',
      dataIndex: 'case_name',
      key: 'case_name',
      ellipsis: true
    },
    {
      title: '법원',
      dataIndex: 'court',
      key: 'court',
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '유형',
      dataIndex: 'case_type',
      key: 'case_type',
      render: (text: string) => <Tag>{text}</Tag>
    },
    {
      title: '선고일',
      dataIndex: 'decision_date',
      key: 'decision_date',
      render: (date: string) => date ? new Date(date).toLocaleDateString('ko-KR') : '-'
    },
    {
      title: '작업',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record.id, 'case')}
        >
          상세보기
        </Button>
      )
    }
  ]

  const statuteColumns = [
    {
      title: '법령명',
      dataIndex: 'statute_name',
      key: 'statute_name',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: '법령번호',
      dataIndex: 'statute_number',
      key: 'statute_number'
    },
    {
      title: '유형',
      dataIndex: 'statute_type',
      key: 'statute_type',
      render: (text: string) => <Tag color="green">{text}</Tag>
    },
    {
      title: '시행일',
      dataIndex: 'effective_date',
      key: 'effective_date',
      render: (date: string) => date ? new Date(date).toLocaleDateString('ko-KR') : '-'
    },
    {
      title: '상태',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? '시행' : '폐지'}
        </Tag>
      )
    },
    {
      title: '작업',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record.id, 'statute')}
        >
          상세보기
        </Button>
      )
    }
  ]

  const tabItems: TabsProps['items'] = [
    {
      key: 'cases',
      label: (
        <span>
          <SearchOutlined /> 판례 검색
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Title level={5}>판례 검색</Title>
                <Search
                  placeholder="사건명, 사건번호, 키워드로 검색"
                  size="large"
                  onSearch={handleSearchCases}
                  loading={loading}
                  enterButton={<SearchOutlined />}
                />
              </div>

              <Row gutter={16}>
                <Col span={8}>
                  <Select
                    placeholder="사건 유형"
                    style={{ width: '100%' }}
                    onChange={setCaseType}
                    allowClear
                  >
                    <Select.Option value="민사">민사</Select.Option>
                    <Select.Option value="형사">형사</Select.Option>
                    <Select.Option value="행정">행정</Select.Option>
                    <Select.Option value="가사">가사</Select.Option>
                  </Select>
                </Col>
                <Col span={8}>
                  <Select
                    placeholder="법률 분야"
                    style={{ width: '100%' }}
                    onChange={setLegalArea}
                    allowClear
                  >
                    <Select.Option value="계약법">계약법</Select.Option>
                    <Select.Option value="불법행위">불법행위</Select.Option>
                    <Select.Option value="부동산법">부동산법</Select.Option>
                    <Select.Option value="형법">형법</Select.Option>
                  </Select>
                </Col>
                <Col span={8}>
                  <Select
                    placeholder="법원"
                    style={{ width: '100%' }}
                    onChange={setCourt}
                    allowClear
                  >
                    <Select.Option value="대법원">대법원</Select.Option>
                    <Select.Option value="고등법원">고등법원</Select.Option>
                    <Select.Option value="지방법원">지방법원</Select.Option>
                  </Select>
                </Col>
              </Row>
            </Space>
          </Card>

          <Card title={`검색 결과 (${cases.length}건)`}>
            <Table
              columns={caseColumns}
              dataSource={cases}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Space>
      )
    },
    {
      key: 'statutes',
      label: (
        <span>
          <SearchOutlined /> 법령 검색
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Title level={5}>법령 검색</Title>
                <Search
                  placeholder="법령명, 법령번호, 키워드로 검색"
                  size="large"
                  onSearch={handleSearchStatutes}
                  loading={loading}
                  enterButton={<SearchOutlined />}
                />
              </div>

              <Row gutter={16}>
                <Col span={12}>
                  <Select
                    placeholder="법령 유형"
                    style={{ width: '100%' }}
                    onChange={setStatuteType}
                    allowClear
                  >
                    <Select.Option value="법률">법률</Select.Option>
                    <Select.Option value="대통령령">대통령령</Select.Option>
                    <Select.Option value="부령">부령</Select.Option>
                    <Select.Option value="헌법">헌법</Select.Option>
                  </Select>
                </Col>
                <Col span={12}>
                  <Select
                    placeholder="분야"
                    style={{ width: '100%' }}
                    allowClear
                  >
                    <Select.Option value="민법">민법</Select.Option>
                    <Select.Option value="상법">상법</Select.Option>
                    <Select.Option value="형법">형법</Select.Option>
                    <Select.Option value="행정법">행정법</Select.Option>
                  </Select>
                </Col>
              </Row>
            </Space>
          </Card>

          <Card title={`검색 결과 (${statutes.length}건)`}>
            <Table
              columns={statuteColumns}
              dataSource={statutes}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Title level={2}>법률 검색</Title>
              <Paragraph type="secondary">
                판례와 법령을 통합 검색하여 관련 법률 정보를 찾아보세요.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: '24px' }}>
          <Tabs
            activeKey={activeTab}
            items={tabItems}
            onChange={setActiveTab}
            size="large"
          />
        </div>

        {/* Detail Modal */}
        <Modal
          title={selectedItem?.type === 'case' ? '판례 상세 정보' : '법령 상세 정보'}
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          width={900}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              닫기
            </Button>
          ]}
        >
          {selectedItem && selectedItem.type === 'case' && (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text type="secondary">사건번호</Text>
                <Title level={4}>{selectedItem.case_number}</Title>
                <Text>{selectedItem.case_name}</Text>
              </div>

              <div>
                <Title level={5}>기본 정보</Title>
                <Space direction="vertical">
                  <Text>법원: {selectedItem.court}</Text>
                  <Text>사건 유형: {selectedItem.case_type}</Text>
                  <Text>법률 분야: {selectedItem.legal_area}</Text>
                  <Text>선고일: {selectedItem.decision_date ? new Date(selectedItem.decision_date).toLocaleDateString('ko-KR') : '-'}</Text>
                </Space>
              </div>

              <div>
                <Title level={5}>요약</Title>
                <Paragraph>{selectedItem.summary}</Paragraph>
              </div>

              {selectedItem.judgment && (
                <div>
                  <Title level={5}>판결 주문</Title>
                  <Paragraph>{selectedItem.judgment}</Paragraph>
                </div>
              )}

              {selectedItem.cited_statutes && selectedItem.cited_statutes.length > 0 && (
                <div>
                  <Title level={5}>인용 법령</Title>
                  <Space wrap>
                    {selectedItem.cited_statutes.map((statute: string, idx: number) => (
                      <Tag key={idx} color="blue">{statute}</Tag>
                    ))}
                  </Space>
                </div>
              )}
            </Space>
          )}

          {selectedItem && selectedItem.type === 'statute' && (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text type="secondary">{selectedItem.statute_number}</Text>
                <Title level={4}>{selectedItem.statute_name}</Title>
              </div>

              <div>
                <Title level={5}>기본 정보</Title>
                <Space direction="vertical">
                  <Text>법령 유형: {selectedItem.statute_type}</Text>
                  <Text>분야: {selectedItem.category}</Text>
                  <Text>공포일: {selectedItem.enacted_date ? new Date(selectedItem.enacted_date).toLocaleDateString('ko-KR') : '-'}</Text>
                  <Text>시행일: {selectedItem.effective_date ? new Date(selectedItem.effective_date).toLocaleDateString('ko-KR') : '-'}</Text>
                  <Text>
                    상태: <Tag color={selectedItem.is_active ? 'success' : 'default'}>
                      {selectedItem.is_active ? '시행' : '폐지'}
                    </Tag>
                  </Text>
                </Space>
              </div>

              {selectedItem.summary && (
                <div>
                  <Title level={5}>요약</Title>
                  <Paragraph>{selectedItem.summary}</Paragraph>
                </div>
              )}

              {selectedItem.articles && selectedItem.articles.length > 0 && (
                <div>
                  <Title level={5}>주요 조문</Title>
                  {selectedItem.articles.slice(0, 5).map((article: any, idx: number) => (
                    <Card key={idx} size="small" style={{ marginBottom: '8px' }}>
                      <Text strong>{article.number} {article.title}</Text>
                      <Paragraph style={{ marginTop: '8px', marginBottom: 0 }}>
                        {article.content}
                      </Paragraph>
                    </Card>
                  ))}
                </div>
              )}
            </Space>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default Research
