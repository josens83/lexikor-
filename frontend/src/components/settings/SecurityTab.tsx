/**
 * Settings - Security Tab Component
 */

import { Card, Space, Form, Button, Switch, Alert, List, Tag } from 'antd'
import { Typography } from 'antd'
import { useCurrentUser, useChangePassword, useEnableMFA, useDisableMFA } from '@hooks/queries'
import { PasswordField } from '@components/form'
import { Modal } from 'antd'

const { Text, Paragraph, Title } = Typography

export function SecurityTab() {
  const { data: profile } = useCurrentUser()
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword()
  const { mutate: enableMFA } = useEnableMFA()
  const { mutate: disableMFA } = useDisableMFA()

  const [passwordForm] = Form.useForm()

  const handleChangePassword = (values: any) => {
    if (values.new_password !== values.confirm_password) {
      return
    }

    changePassword(
      {
        current_password: values.current_password,
        new_password: values.new_password,
      },
      {
        onSuccess: () => {
          passwordForm.resetFields()
        },
      }
    )
  }

  const handleToggleMFA = () => {
    Modal.confirm({
      title: profile?.mfa_enabled ? '2단계 인증 비활성화' : '2단계 인증 활성화',
      content: profile?.mfa_enabled
        ? '2단계 인증을 비활성화하시겠습니까? 계정 보안이 약해질 수 있습니다.'
        : '2단계 인증을 활성화하여 계정을 더욱 안전하게 보호하세요.',
      okText: '확인',
      cancelText: '취소',
      onOk: () => {
        if (profile?.mfa_enabled) {
          disableMFA()
        } else {
          enableMFA()
        }
      },
    })
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* Password Change */}
      <Card title="비밀번호 변경">
        <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
          <PasswordField
            name="current_password"
            label="현재 비밀번호"
            required
            showStrengthIndicator={false}
          />

          <PasswordField
            name="new_password"
            label="새 비밀번호"
            required
            showStrengthIndicator
          />

          <Form.Item
            name="confirm_password"
            label="새 비밀번호 확인"
            rules={[
              { required: true, message: '새 비밀번호를 다시 입력하세요' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('비밀번호가 일치하지 않습니다'))
                },
              }),
            ]}
          >
            <PasswordField
              name="confirm_password"
              showStrengthIndicator={false}
              required={false}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={isChangingPassword}>
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
            <Switch checked={profile?.mfa_enabled} onChange={handleToggleMFA} />
            <Text strong>{profile?.mfa_enabled ? '활성화됨' : '비활성화됨'}</Text>
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
              current: true,
            },
          ]}
          renderItem={(session) => (
            <List.Item
              actions={[
                !session.current && (
                  <Button type="link" danger>
                    로그아웃
                  </Button>
                ),
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
}
