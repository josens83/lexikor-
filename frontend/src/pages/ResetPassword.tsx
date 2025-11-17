import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message, Result } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { authAPI } from '../services/api'

const { Title, Paragraph } = Typography

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const token = searchParams.get('token')

  if (!token) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Card style={{ width: 500 }}>
          <Result
            status="error"
            title="유효하지 않은 링크"
            subTitle="비밀번호 재설정 토큰이 없습니다. 비밀번호 찾기를 다시 시도해주세요."
            extra={
              <Button type="primary" onClick={() => navigate('/forgot-password')}>
                비밀번호 찾기
              </Button>
            }
          />
        </Card>
      </div>
    )
  }

  const onFinish = async (values: { password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)
    try {
      await authAPI.resetPassword(token, values.password)
      setResetSuccess(true)
      message.success('비밀번호가 성공적으로 변경되었습니다.')
    } catch (error: any) {
      message.error(error.response?.data?.detail || '비밀번호 재설정에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (resetSuccess) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Card style={{ width: 500 }}>
          <Result
            status="success"
            title="비밀번호 재설정 완료"
            subTitle="비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해주세요."
            extra={
              <Button
                type="primary"
                onClick={() => navigate('/login')}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                로그인하기
              </Button>
            }
          />
        </Card>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 450, padding: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={2} style={{ marginBottom: 10 }}>
            🔐 새 비밀번호 설정
          </Title>
          <Paragraph type="secondary">
            새로운 비밀번호를 입력해주세요.
          </Paragraph>
        </div>

        <Form
          name="reset-password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="password"
            label="새 비밀번호"
            rules={[
              { required: true, message: '비밀번호를 입력해주세요' },
              { min: 8, message: '비밀번호는 최소 8자 이상이어야 합니다' }
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="새 비밀번호 (8자 이상)"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="비밀번호 확인"
            dependencies={['password']}
            rules={[
              { required: true, message: '비밀번호를 다시 입력해주세요' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('비밀번호가 일치하지 않습니다'))
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="비밀번호 확인"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              비밀번호 재설정
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Paragraph type="secondary" style={{ fontSize: 12 }}>
            ※ 비밀번호는 8자 이상이어야 합니다.<br />
            ※ 안전한 비밀번호를 위해 영문, 숫자, 특수문자를 조합하세요.
          </Paragraph>
        </div>
      </Card>
    </div>
  )
}

export default ResetPassword
