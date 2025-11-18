/**
 * Research - Case Search Tab Component
 */

import { useState } from 'react'
import { Card, Input, Table, Space, Row, Col, Select } from 'antd'
import { Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useSearchCasesMutation } from '@hooks/queries'
import { caseColumns } from './researchColumns'

const { Title } = Typography
const { Search } = Input

interface CaseSearchTabProps {
  onViewDetail: (id: number) => void
}

export function CaseSearchTab({ onViewDetail }: CaseSearchTabProps) {
  const [caseType, setCaseType] = useState<string>()
  const [legalArea, setLegalArea] = useState<string>()
  const [court, setCourt] = useState<string>()

  const { mutate: searchCases, data, isPending } = useSearchCasesMutation()
  const cases = (data?.data as any) || []

  const handleSearch = (value: string) => {
    if (!value.trim()) return

    searchCases({
      query: value,
      limit: 20,
    } as any)
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <Title level={5}>판례 검색</Title>
            <Search
              placeholder="사건명, 사건번호, 키워드로 검색"
              size="large"
              onSearch={handleSearch}
              loading={isPending}
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
          columns={caseColumns(onViewDetail)}
          dataSource={cases}
          rowKey="id"
          loading={isPending}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </Space>
  )
}
