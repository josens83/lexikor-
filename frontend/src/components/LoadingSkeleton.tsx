/**
 * Reusable Loading Skeleton Components
 *
 * Professional loading states used by modern apps like LinkedIn, Facebook, Notion
 * Shows skeleton placeholders while content is loading instead of spinners
 */

import { Skeleton, Card, Row, Col, Space } from 'antd'

/**
 * Dashboard Page Skeleton
 * Used in Dashboard.tsx while loading user data
 */
export const DashboardSkeleton = () => {
  return (
    <div style={{ padding: '24px' }}>
      {/* Header Skeleton */}
      <div style={{ marginBottom: 24 }}>
        <Skeleton.Input active style={{ width: 300, height: 32, marginBottom: 8 }} />
        <Skeleton.Input active style={{ width: 200, height: 20 }} />
      </div>

      {/* Stats Cards Skeleton */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[1, 2, 3, 4].map((i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card>
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Activity Skeleton */}
      <Card title={<Skeleton.Input active style={{ width: 150 }} />}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
          ))}
        </Space>
      </Card>
    </div>
  )
}

/**
 * Chat Page Skeleton
 * Used in Chat.tsx while loading conversations
 */
export const ChatSkeleton = () => {
  return (
    <Row style={{ height: '100vh' }}>
      {/* Conversation List Skeleton */}
      <Col span={6} style={{ borderRight: '1px solid #f0f0f0', padding: 16 }}>
        <Skeleton.Input active style={{ width: '100%', marginBottom: 16 }} />
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
          ))}
        </Space>
      </Col>

      {/* Chat Messages Skeleton */}
      <Col span={18} style={{ padding: 24 }}>
        <Skeleton.Input active style={{ width: 200, height: 24, marginBottom: 24 }} />
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
              <div style={{ maxWidth: '70%' }}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            </div>
          ))}
        </Space>
      </Col>
    </Row>
  )
}

/**
 * Documents Page Skeleton
 * Used in Documents.tsx while loading document list
 */
export const DocumentsSkeleton = () => {
  return (
    <div style={{ padding: 24 }}>
      {/* Header with Search */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton.Input active style={{ width: 300 }} />
        <Skeleton.Button active style={{ width: 120 }} />
      </div>

      {/* Document Cards Grid */}
      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Col xs={24} sm={12} lg={8} key={i}>
            <Card>
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

/**
 * Table Skeleton
 * Used for data tables while loading
 */
export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div style={{ padding: 24 }}>
      {/* Table Header */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {[1, 2, 3, 4].map((i) => (
          <Col span={6} key={i}>
            <Skeleton.Input active style={{ width: '100%' }} />
          </Col>
        ))}
      </Row>

      {/* Table Rows */}
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {Array.from({ length: rows }).map((_, i) => (
          <Row gutter={16} key={i}>
            {[1, 2, 3, 4].map((j) => (
              <Col span={6} key={j}>
                <Skeleton.Input active style={{ width: '100%', height: 32 }} />
              </Col>
            ))}
          </Row>
        ))}
      </Space>
    </div>
  )
}

/**
 * Form Skeleton
 * Used while loading form data
 */
export const FormSkeleton = () => {
  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Skeleton.Input active style={{ width: 150, height: 20, marginBottom: 8 }} />
            <Skeleton.Input active style={{ width: '100%', height: 40 }} />
          </div>
        ))}
        <Skeleton.Button active style={{ width: 120, height: 40 }} />
      </Space>
    </div>
  )
}

/**
 * Profile Skeleton
 * Used in Settings/Profile pages
 */
export const ProfileSkeleton = () => {
  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        {/* Avatar and Basic Info */}
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Skeleton.Avatar active size={120} style={{ marginBottom: 16 }} />
              <Skeleton.Input active style={{ width: '80%', marginBottom: 8 }} />
              <Skeleton.Input active style={{ width: '60%' }} />
            </div>
          </Card>
        </Col>

        {/* Detailed Info */}
        <Col xs={24} md={16}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                  <Skeleton.Input active style={{ width: 120, height: 20, marginBottom: 8 }} />
                  <Skeleton.Input active style={{ width: '100%', height: 40 }} />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

/**
 * Card List Skeleton
 * Generic skeleton for card-based layouts
 */
export const CardListSkeleton = ({ count = 6, cols = 3 }: { count?: number; cols?: number }) => {
  const span = 24 / cols

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        {Array.from({ length: count }).map((_, i) => (
          <Col xs={24} sm={12} lg={span} key={i}>
            <Card>
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

/**
 * Page Loading Skeleton
 * Generic full-page loading skeleton
 */
export const PageSkeleton = () => {
  return (
    <div style={{ padding: 24 }}>
      <Skeleton.Input active style={{ width: 300, height: 40, marginBottom: 24 }} />
      <Skeleton active paragraph={{ rows: 10 }} />
    </div>
  )
}
