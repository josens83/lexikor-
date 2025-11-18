/**
 * Research Page - Refactored with Component Extraction
 *
 * Reduced from 442 lines to ~90 lines by extracting tab and modal components
 */

import { useState } from 'react'
import { Card, Tabs, Row, Col } from 'antd'
import { Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { CaseSearchTab, StatuteSearchTab, ResearchDetailModal } from '@components/research'
import { useCaseDetail, useStatuteDetail } from '@hooks/queries'
import type { TabsProps } from 'antd'

const { Title, Paragraph } = Typography

const Research = () => {
  const [activeTab, setActiveTab] = useState('cases')
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<'case' | 'statute'>('case')

  // Fetch detail based on type
  const { data: caseDetail } = useCaseDetail(
    selectedType === 'case' && selectedId ? selectedId : 0
  )
  const { data: statuteDetail } = useStatuteDetail(
    selectedType === 'statute' && selectedId ? selectedId : 0
  )

  const handleViewDetail = (id: number, type: 'case' | 'statute') => {
    setSelectedId(id)
    setSelectedType(type)
    setDetailModalVisible(true)
  }

  const selectedItem = selectedType === 'case'
    ? caseDetail ? { ...caseDetail, type: 'case' } : null
    : statuteDetail ? { ...statuteDetail, type: 'statute' } : null

  const tabItems: TabsProps['items'] = [
    {
      key: 'cases',
      label: (
        <span>
          <SearchOutlined /> 판례 검색
        </span>
      ),
      children: <CaseSearchTab onViewDetail={(id) => handleViewDetail(id, 'case')} />,
    },
    {
      key: 'statutes',
      label: (
        <span>
          <SearchOutlined /> 법령 검색
        </span>
      ),
      children: <StatuteSearchTab onViewDetail={(id) => handleViewDetail(id, 'statute')} />,
    },
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
        <ResearchDetailModal
          visible={detailModalVisible}
          onClose={() => setDetailModalVisible(false)}
          item={selectedItem}
        />
      </div>
    </div>
  )
}

export default Research
