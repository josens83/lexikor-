import { useState, useEffect } from 'react'
import { Card, Row, Col, Typography, Tabs, Form, Input, Button, Space, Switch, Modal, message, Divider, Alert, List } from 'antd'
import { UserOutlined, LockOutlined, BellOutlined, SafetyOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { authAPI } from '../services/api'
import type { TabsProps } from 'antd'
import DataExportModal from '../components/DataExportModal'

const { Title, Text, Paragraph } = Typography

interface UserProfile {
  id: number
  email: string
  full_name: string
  phone?: string
  role: string
  is_verified: boolean
  mfa_enabled: boolean
}

const Settings = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [exportModalVisible, setExportModalVisible] = useState(false)
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    chat_notifications: true,
    document_notifications: true,
    marketing_emails: false
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const response = await authAPI.getMe()
      setProfile(response.data)
      profileForm.setFieldsValue({
        full_name: response.data.full_name,
        email: response.data.email,
        phone: response.data.phone
      })
    } catch (error) {
      message.error('프로필 정보를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (values: any) => {
    setSaving(true)
    try {
      await authAPI.updateProfile(values)
      message.success('프로필이 업데이트되었습니다')
      await loadProfile()
    } catch (error) {
      message.error('프로필 업데이트에 실패했습니다')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (values: any) => {
    if (values.new_password !== values.confirm_password) {
      message.error('새 비밀번호가 일치하지 않습니다')
      return
    }

    setSaving(true)
    try {
      await authAPI.changePassword({
        current_password: values.current_password,
        new_password: values.new_password
      })
      message.success('비밀번호가 변경되었습니다')
      passwordForm.resetFields()
    } catch (error: any) {
      message.error(error.response?.data?.detail || '비밀번호 변경에 실패했습니다')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleMFA = async () => {
    Modal.confirm({
      title: profile?.mfa_enabled ? '2단계 인증 비활성화' : '2단계 인증 활성화',
      content: profile?.mfa_enabled
        ? '2단계 인증을 비활성화하시겠습니까? 계정 보안이 약해질 수 있습니다.'
        : '2단계 인증을 활성화하여 계정을 더욱 안전하게 보호하세요.',
      okText: '확인',
      cancelText: '취소',
      onOk: async () => {
        try {
          await authAPI.toggleMFA()
          message.success(
            profile?.mfa_enabled
              ? '2단계 인증이 비활성화되었습니다'
              : '2단계 인증이 활성화되었습니다'
          )
          await loadProfile()
        } catch (error) {
          message.error('2단계 인증 설정 변경에 실패했습니다')
        }
      }
    })
  }

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: '계정 삭제',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <Paragraph>정말로 계정을 삭제하시겠습니까?</Paragraph>
          <Paragraph type="danger" strong>
            이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
          </Paragraph>
        </div>
      ),
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: async () => {
        try {
          await authAPI.deleteAccount()
          message.success('계정이 삭제되었습니다')
          // Clear tokens and redirect to login
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        } catch (error) {
          message.error('계정 삭제에 실패했습니다')
        }
      }
    })
  }

  const handleExportData = () => {
    setExportModalVisible(true)
  }

  const tabItems: TabsProps['items'] = [
    {
      key: 'profile',
      label: (
        <span>
          <UserOutlined /> 프로필
        </span>
      ),
      children: (
        <Card>
          <Form
            form={profileForm}
            layout="vertical"
            onFinish={handleUpdateProfile}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="full_name"
                  label="이름"
                  rules={[{ required: true, message: '이름을 입력하세요' }]}
                >
                  <Input size="large" placeholder="홍길동" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="이메일"
                >
                  <Input
                    size="large"
                    disabled
                    suffix={
                      profile?.is_verified && (
                        <SafetyOutlined style={{ color: '#52c41a' }} />
                      )
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="전화번호"
                >
                  <Input size="large" placeholder="010-1234-5678" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="역할">
                  <Input size="large" value={profile?.role} disabled />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Button type="primary" htmlType="submit" loading={saving} size="large">
              프로필 저장
            </Button>
          </Form>
        </Card>
      )
    },
    {
      key: 'security',
      label: (
        <span>
          <LockOutlined /> 보안
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* Password Change */}
          <Card title="비밀번호 변경">
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
            >
              <Form.Item
                name="current_password"
                label="현재 비밀번호"
                rules={[{ required: true, message: '현재 비밀번호를 입력하세요' }]}
              >
                <Input.Password size="large" />
              </Form.Item>

              <Form.Item
                name="new_password"
                label="새 비밀번호"
                rules={[
                  { required: true, message: '새 비밀번호를 입력하세요' },
                  { min: 8, message: '비밀번호는 최소 8자 이상이어야 합니다' }
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>

              <Form.Item
                name="confirm_password"
                label="새 비밀번호 확인"
                rules={[{ required: true, message: '새 비밀번호를 다시 입력하세요' }]}
              >
                <Input.Password size="large" />
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={saving}>
                비밀번호 변경
              </Button>
            </Form>
          </Card>

          {/* Two-Factor Authentication */}
          <Card title="2단계 인증 (MFA)">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Paragraph>
                2단계 인증을 활성화하면 로그인 시 비밀번호 외에 추가 인증 코드가 필요합니다.
              </Paragraph>
              <Space>
                <Switch
                  checked={profile?.mfa_enabled}
                  onChange={handleToggleMFA}
                />
                <Text strong>
                  {profile?.mfa_enabled ? '활성화됨' : '비활성화됨'}
                </Text>
              </Space>
              {profile?.mfa_enabled && (
                <Alert
                  message="2단계 인증이 활성화되어 있습니다"
                  description="계정이 추가 보안 계층으로 보호됩니다."
                  type="success"
                  showIcon
                />
              )}
            </Space>
          </Card>

          {/* Active Sessions */}
          <Card title="활성 세션">
            <List
              dataSource={[
                {
                  device: '현재 브라우저',
                  location: 'Seoul, South Korea',
                  lastActive: '방금 전',
                  current: true
                }
              ]}
              renderItem={(session) => (
                <List.Item
                  actions={[
                    !session.current && (
                      <Button type="link" danger>
                        로그아웃
                      </Button>
                    )
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        {session.device}
                        {session.current && <Tag color="green">현재 세션</Tag>}
                      </Space>
                    }
                    description={`${session.location} • ${session.lastActive}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Space>
      )
    },
    {
      key: 'notifications',
      label: (
        <span>
          <BellOutlined /> 알림
        </span>
      ),
      children: (
        <Card>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div>
              <Title level={5}>이메일 알림</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <div>
                    <Text strong>채팅 알림</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      새로운 AI 응답이 도착하면 이메일을 받습니다
                    </Text>
                  </div>
                  <Switch
                    checked={notificationSettings.chat_notifications}
                    onChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, chat_notifications: checked })
                    }
                  />
                </Space>

                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <div>
                    <Text strong>문서 처리 알림</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      문서 분석이 완료되면 이메일을 받습니다
                    </Text>
                  </div>
                  <Switch
                    checked={notificationSettings.document_notifications}
                    onChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, document_notifications: checked })
                    }
                  />
                </Space>

                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <div>
                    <Text strong>마케팅 이메일</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      새로운 기능 및 프로모션 정보를 받습니다
                    </Text>
                  </div>
                  <Switch
                    checked={notificationSettings.marketing_emails}
                    onChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, marketing_emails: checked })
                    }
                  />
                </Space>
              </Space>
            </div>

            <Divider />

            <Button type="primary" onClick={() => message.success('알림 설정이 저장되었습니다')}>
              설정 저장
            </Button>
          </Space>
        </Card>
      )
    },
    {
      key: 'account',
      label: (
        <span>
          <DeleteOutlined /> 계정
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Card title="데이터 내보내기">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Paragraph>
                계정과 관련된 모든 데이터를 JSON 형식으로 내보낼 수 있습니다.
                대화 내역, 문서, 설정 등이 포함됩니다.
              </Paragraph>
              <Button onClick={handleExportData}>
                데이터 내보내기
              </Button>
            </Space>
          </Card>

          <Card title="계정 삭제">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Alert
                message="경고"
                description="계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다."
                type="error"
                showIcon
              />
              <Paragraph>
                계정을 삭제하면 다음 데이터가 모두 삭제됩니다:
              </Paragraph>
              <ul>
                <li>프로필 정보</li>
                <li>모든 대화 내역</li>
                <li>업로드한 문서</li>
                <li>구독 정보</li>
                <li>설정 및 환경설정</li>
              </ul>
              <Button danger onClick={handleDeleteAccount}>
                계정 삭제
              </Button>
            </Space>
          </Card>
        </Space>
      )
    }
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

      {/* Data Export Modal */}
      <DataExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
      />
    </div>
  )
}

export default Settings
