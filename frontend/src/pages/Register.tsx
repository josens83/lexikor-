import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

const { Title, Text } = Typography

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      await authAPI.register({
        email: values.email,
        password: values.password,
        full_name: values.full_name,
        phone: values.phone
      })

      message.success('회원가입 성공! 로그인 페이지로 이동합니다.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (error: any) {
      message.error(error.response?.data?.detail || '회원가입에 실패했습니다')
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
      <Card style={{ width: 450, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            LexiKor 가입하기
          </Title>
          <Text type="secondary">14일 무료 체험을 시작하세요</Text>
        </div>

        <Form
          name="register"
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
            <Input prefix={<MailOutlined />} placeholder="email@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="비밀번호"
            rules={[
              { required: true, message: '비밀번호를 입력하세요' },
              { min: 8, message: '비밀번호는 최소 8자 이상이어야 합니다' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="비밀번호 (8자 이상)" />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label="비밀번호 확인"
            dependencies={['password']}
            rules={[
              { required: true, message: '비밀번호를 다시 입력하세요' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('비밀번호가 일치하지 않습니다'))
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="비밀번호 확인" />
          </Form.Item>

          <Form.Item
            name="full_name"
            label="이름"
            rules={[{ required: true, message: '이름을 입력하세요' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="홍길동" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="전화번호 (선택)"
          >
            <Input prefix={<PhoneOutlined />} placeholder="010-1234-5678" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              가입하기
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>
              이미 계정이 있으신가요?{' '}
              <a onClick={() => navigate('/login')}>로그인</a>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Register
