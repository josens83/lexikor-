import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Result, Button, Card, Typography, Collapse } from 'antd'
import { FrownOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons'

const { Text, Paragraph } = Typography
const { Panel } = Collapse

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // In production, you would send this to an error reporting service like Sentry
    // Example: Sentry.captureException(error, { extra: errorInfo })

    this.setState({
      error,
      errorInfo
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV

      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f2f5',
          padding: '20px'
        }}>
          <Card style={{ maxWidth: 800, width: '100%' }}>
            <Result
              icon={<FrownOutlined style={{ color: '#ff4d4f' }} />}
              title="문제가 발생했습니다"
              subTitle={
                <div>
                  <Paragraph>
                    죄송합니다. 예기치 않은 오류가 발생했습니다.
                    페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
                  </Paragraph>

                  {isDevelopment && this.state.error && (
                    <div style={{ marginTop: 20, textAlign: 'left' }}>
                      <Collapse>
                        <Panel header="개발자 정보 (프로덕션에서는 표시되지 않음)" key="1">
                          <div style={{
                            background: '#f5f5f5',
                            padding: 16,
                            borderRadius: 4,
                            fontFamily: 'monospace',
                            fontSize: 12,
                            overflow: 'auto'
                          }}>
                            <Text strong>Error:</Text>
                            <pre style={{ marginTop: 8, marginBottom: 16 }}>
                              {this.state.error.toString()}
                            </pre>

                            {this.state.errorInfo && (
                              <>
                                <Text strong>Component Stack:</Text>
                                <pre style={{ marginTop: 8 }}>
                                  {this.state.errorInfo.componentStack}
                                </pre>
                              </>
                            )}
                          </div>
                        </Panel>
                      </Collapse>
                    </div>
                  )}
                </div>
              }
              extra={[
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={this.handleReload}
                  key="reload"
                >
                  페이지 새로고침
                </Button>,
                <Button
                  icon={<HomeOutlined />}
                  onClick={this.handleGoHome}
                  key="home"
                >
                  홈으로 이동
                </Button>
              ]}
            />

            <div style={{
              marginTop: 20,
              padding: 16,
              background: '#f0f2f5',
              borderRadius: 8,
              textAlign: 'center'
            }}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                문제가 계속되면 support@lexikor.ai로 문의해주세요.
              </Text>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
