import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message, Result } from 'antd'
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { authAPI } from '../services/api'

const { Title, Paragraph } = Typography

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const onFinish = async (values: { email: string }) => {
    setLoading(true)
    try {
      await authAPI.forgotPassword(values.email)
      setSubmittedEmail(values.email)
      setEmailSent(true)
      message.success('비밀번호 재설정 이메일이 전송되었습니다.')
    } catch (error: any) {
      message.error(error.response?.data?.detail || '비밀번호 재설정 요청에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
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
            title="이메일 전송 완료"
            subTitle={
              <>
                <Paragraph>
                  <strong>{submittedEmail}</strong>로 비밀번호 재설정 링크를 전송했습니다.
                </Paragraph>
                <Paragraph>
                  이메일을 확인하시고 링크를 클릭하여 비밀번호를 재설정해주세요.
                </Paragraph>
                <Paragraph type="secondary" style={{ fontSize: 12 }}>
                  ※ 이메일이 도착하지 않은 경우 스팸 폴더를 확인해주세요.<br />
                  ※ 링크는 1시간 동안 유효합니다.
                </Paragraph>
              </>
            }
            extra={[
              <Button
                type="primary"
                key="login"
                onClick={() => navigate('/login')}
              >
                로그인 페이지로
              </Button>,
              <Button key="home" onClick={() => navigate('/')}>
                홈으로
              </Button>
            ]}
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
            🔒 비밀번호 찾기
          </Title>
          <Paragraph type="secondary">
            가입하신 이메일 주소를 입력하시면<br />
            비밀번호 재설정 링크를 보내드립니다.
          </Paragraph>
        </div>

        <Form
          name="forgot-password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="이메일"
            rules={[
              { required: true, message: '이메일을 입력해주세요' },
              { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="example@email.com"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 10 }}>
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
              비밀번호 재설정 링크 보내기
            </Button>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/login')}
              block
            >
              로그인 페이지로 돌아가기
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ForgotPassword
