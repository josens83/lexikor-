import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Result, Button, Spin } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { authAPI } from '../services/api'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token')

      if (!token) {
        setError('인증 토큰이 없습니다.')
        setLoading(false)
        return
      }

      try {
        await authAPI.verifyEmail(token)
        setSuccess(true)
      } catch (err: any) {
        setError(err.response?.data?.detail || '이메일 인증에 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [searchParams])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Card style={{ width: 500, textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: 20 }}>이메일 인증 중...</div>
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
      <Card style={{ width: 500 }}>
        {success ? (
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="이메일 인증 완료!"
            subTitle="이메일 인증이 성공적으로 완료되었습니다. 이제 모든 서비스를 이용하실 수 있습니다."
            extra={[
              <Button
                type="primary"
                key="login"
                onClick={() => navigate('/login')}
              >
                로그인하기
              </Button>,
              <Button key="home" onClick={() => navigate('/')}>
                홈으로
              </Button>
            ]}
          />
        ) : (
          <Result
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            title="이메일 인증 실패"
            subTitle={error || '알 수 없는 오류가 발생했습니다.'}
            extra={[
              <Button
                type="primary"
                key="home"
                onClick={() => navigate('/')}
              >
                홈으로
              </Button>
            ]}
          />
        )}
      </Card>
    </div>
  )
}

export default VerifyEmail
