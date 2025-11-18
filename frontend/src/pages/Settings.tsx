/**
 * Settings Page - Refactored with Tab Components
 *
 * Reduced from 479 lines to ~60 lines by extracting tab components
 */

import { Card, Row, Col, Typography, Tabs } from 'antd'
import { UserOutlined, LockOutlined, BellOutlined, DeleteOutlined } from '@ant-design/icons'
import { ProfileTab, SecurityTab, NotificationsTab, AccountTab } from '@components/settings'
import type { TabsProps } from 'antd'

const { Title, Paragraph } = Typography

const Settings = () => {
  const tabItems: TabsProps['items'] = [
    {
      key: 'profile',
      label: (
        <span>
          <UserOutlined /> 프로필
        </span>
      ),
      children: <ProfileTab />,
    },
    {
      key: 'security',
      label: (
        <span>
          <LockOutlined /> 보안
        </span>
      ),
      children: <SecurityTab />,
    },
    {
      key: 'notifications',
      label: (
        <span>
          <BellOutlined /> 알림
        </span>
      ),
      children: <NotificationsTab />,
    },
    {
      key: 'account',
      label: (
        <span>
          <DeleteOutlined /> 계정
        </span>
      ),
      children: <AccountTab />,
    },
  ]

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Title level={2}>설정</Title>
              <Paragraph type="secondary">
                계정, 보안, 알림 설정을 관리하세요.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: '24px' }}>
          <Tabs
            defaultActiveKey="profile"
            items={tabItems}
            size="large"
            tabPosition="left"
          />
        </div>
      </div>
    </div>
  )
}

export default Settings
