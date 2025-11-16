import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

const { Title, Text } = Typography

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const formData = new URLSearchParams()
      formData.append('username', values.email)
      formData.append('password', values.password)

      const response = await authAPI.login(formData)

      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)

      message.success('로그인 성공!')
      navigate('/dashboard')
    } catch (error: any) {
      message.error(error.response?.data?.detail || '로그인에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            LexiKor
          </Title>
          <Text type="secondary">법률 AI 어시스턴트에 로그인하세요</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="이메일"
            rules={[
              { required: true, message: '이메일을 입력하세요' },
              { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="email@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="비밀번호"
            rules={[{ required: true, message: '비밀번호를 입력하세요' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              로그인
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>
              계정이 없으신가요?{' '}
              <a onClick={() => navigate('/register')}>회원가입</a>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login
