import { useState, useEffect } from 'react'
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd'
import {
  DashboardOutlined,
  MessageOutlined,
  FileTextOutlined,
  SearchOutlined,
  FormOutlined,
  BarChartOutlined,
  CreditCardOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  TeamOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import type { MenuProps } from 'antd'
import NotificationCenter from './NotificationCenter'
import FeedbackWidget from './FeedbackWidget'

const { Header, Sider, Content } = Layout
const { Text } = Typography

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Load user info from localStorage or API
    const token = localStorage.getItem('access_token')
    if (token) {
      // TODO: Fetch user info from API
      setUser({
        name: '테스트 사용자',
        email: 'test@example.com',
        plan: 'Professional'
      })
    }
  }, [])

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <span data-tour="dashboard">대시보드</span>,
      onClick: () => navigate('/dashboard')
    },
    {
      key: '/chat',
      icon: <MessageOutlined />,
      label: <span data-tour="chat">AI 채팅</span>,
      onClick: () => navigate('/chat')
    },
    {
      key: '/documents',
      icon: <FileTextOutlined />,
      label: <span data-tour="documents">문서 관리</span>,
      onClick: () => navigate('/documents')
    },
    {
      key: '/research',
      icon: <SearchOutlined />,
      label: <span data-tour="research">법률 검색</span>,
      onClick: () => navigate('/research')
    },
    {
      key: '/templates',
      icon: <FormOutlined />,
      label: <span data-tour="templates">문서 템플릿</span>,
      onClick: () => navigate('/templates')
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: <span data-tour="analytics">사용량 분석</span>,
      onClick: () => navigate('/analytics')
    },
    {
      type: 'divider'
    },
    {
      key: '/billing',
      icon: <CreditCardOutlined />,
      label: '구독 & 결제',
      onClick: () => navigate('/billing')
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <span data-tour="settings">설정</span>,
      onClick: () => navigate('/settings')
    },
    {
      type: 'divider'
    },
    {
      key: '/help',
      icon: <QuestionCircleOutlined />,
      label: '도움말',
      onClick: () => navigate('/help')
    },
    {
      key: '/admin',
      icon: <TeamOutlined />,
      label: '관리자',
      onClick: () => navigate('/admin')
    }
  ]

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '내 프로필',
      onClick: () => navigate('/settings')
    },
    {
      key: 'billing',
      icon: <CreditCardOutlined />,
      label: '구독 관리',
      onClick: () => navigate('/billing')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '로그아웃',
      danger: true,
      onClick: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        navigate('/login')
      }
    }
  ]

  // Get current selected menu key from location
  const selectedKey = location.pathname

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Logo */}
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          margin: '16px',
          borderRadius: '8px'
        }}>
          <Text style={{
            color: '#fff',
            fontSize: collapsed ? '18px' : '24px',
            fontWeight: 'bold',
            transition: 'font-size 0.3s'
          }}>
            {collapsed ? 'L' : 'LexiKor'}
          </Text>
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />

        {/* Plan Badge */}
        {!collapsed && user && (
          <div style={{
            position: 'absolute',
            bottom: '80px',
            left: '16px',
            right: '16px',
            padding: '12px',
            background: 'rgba(24, 144, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(24, 144, 255, 0.3)'
          }}>
            <Text style={{ color: '#fff', fontSize: '12px' }}>플랜</Text>
            <div style={{ marginTop: '4px' }}>
              <Text style={{ color: '#1890ff', fontWeight: 'bold' }}>
                {user.plan}
              </Text>
            </div>
          </div>
        )}
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
        {/* Header */}
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}>
          {/* Page Title */}
          <div>
            <Text style={{ fontSize: '18px', fontWeight: 500 }}>
              {location.pathname === '/dashboard' && '대시보드'}
              {location.pathname.startsWith('/chat') && 'AI 채팅'}
              {location.pathname === '/documents' && '문서 관리'}
              {location.pathname === '/research' && '법률 검색'}
              {location.pathname === '/templates' && '문서 템플릿'}
              {location.pathname === '/analytics' && '사용량 분석'}
              {location.pathname === '/billing' && '구독 & 결제'}
              {location.pathname === '/settings' && '설정'}
              {location.pathname === '/help' && '도움말'}
              {location.pathname === '/admin' && '관리자 대시보드'}
              {location.pathname === '/admin/users' && '사용자 관리'}
            </Text>
          </div>

          {/* User Actions */}
          <Space size="large">
            {/* Notifications */}
            <NotificationCenter />

            {/* User Menu */}
            {user && (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar icon={<UserOutlined />} style={{ background: '#1890ff' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Text strong>{user.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{user.email}</Text>
                  </div>
                </Space>
              </Dropdown>
            )}
          </Space>
        </Header>

        {/* Content */}
        <Content style={{ margin: 0, overflow: 'initial' }}>
          {children}
        </Content>

        {/* Feedback Widget - Floating button */}
        <FeedbackWidget />
      </Layout>
    </Layout>
  )
}

export default MainLayout
