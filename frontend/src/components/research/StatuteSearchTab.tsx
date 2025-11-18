/**
 * Research - Statute Search Tab Component
 */

import { useState } from 'react'
import { Card, Input, Table, Space, Row, Col, Select } from 'antd'
import { Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useSearchStatutesMutation } from '@hooks/queries'
import { statuteColumns } from './researchColumns'

const { Title } = Typography
const { Search } = Input

interface StatuteSearchTabProps {
  onViewDetail: (id: number) => void
}

export function StatuteSearchTab({ onViewDetail }: StatuteSearchTabProps) {
  const [statuteType, setStatuteType] = useState<string>()

  const { mutate: searchStatutes, data, isPending } = useSearchStatutesMutation()
  const statutes = (data?.data as any) || []

  const handleSearch = (value: string) => {
    if (!value.trim()) return

    searchStatutes({
      query: value,
      limit: 20,
    } as any)
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <Title level={5}>법령 검색</Title>
            <Search
              placeholder="법령명, 법령번호, 키워드로 검색"
              size="large"
              onSearch={handleSearch}
              loading={isPending}
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
              <Select placeholder="분야" style={{ width: '100%' }} allowClear>
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
          columns={statuteColumns(onViewDetail)}
          dataSource={statutes}
          rowKey="id"
          loading={isPending}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </Space>
  )
}
