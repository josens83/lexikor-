/**
 * Billing History & Invoice Download Page
 *
 * Separate page for payment history and invoice management
 * Similar to Stripe, Notion, GitHub billing pages
 */

import { useState, useEffect } from 'react'
import { Card, Typography, Button, Table, Tag, Empty, message, Row, Col, Statistic, Space } from 'antd'
import {
  DownloadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography

interface PaymentRecord {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  plan: string
  period: string
  invoice_url?: string
  receipt_url?: string
  description: string
  payment_method?: string
}

const BillingHistory = () => {
  const navigate = useNavigate()
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total_spent: 0,
    total_payments: 0,
    current_plan: 'Free'
  })

  useEffect(() => {
    loadPaymentHistory()
    loadStats()
  }, [])

  const loadPaymentHistory = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      // const response = await billingAPI.getPaymentHistory()
      // setPayments(response.data)

      // Mock data
      const mockPayments: PaymentRecord[] = [
        {
          id: 'inv_2024_001',
          date: '2024-01-15T10:30:00Z',
          amount: 99000,
          status: 'paid',
          plan: 'Professional',
          period: '2024-01 ~ 2024-02',
          invoice_url: 'https://stripe.com/invoice/inv_001',
          description: 'LexiKor Professional 월간 구독',
          payment_method: 'Visa ****1234'
        },
        {
          id: 'inv_2023_012',
          date: '2023-12-15T10:30:00Z',
          amount: 99000,
          status: 'paid',
          plan: 'Professional',
          period: '2023-12 ~ 2024-01',
          invoice_url: 'https://stripe.com/invoice/inv_002',
          description: 'LexiKor Professional 월간 구독',
          payment_method: 'Visa ****1234'
        },
        {
          id: 'inv_2023_011',
          date: '2023-11-15T10:30:00Z',
          amount: 99000,
          status: 'paid',
          plan: 'Professional',
          period: '2023-11 ~ 2023-12',
          invoice_url: 'https://stripe.com/invoice/inv_003',
          description: 'LexiKor Professional 월간 구독',
          payment_method: 'Visa ****1234'
        },
        {
          id: 'inv_2023_010',
          date: '2023-10-15T10:30:00Z',
          amount: 99000,
          status: 'paid',
          plan: 'Professional',
          period: '2023-10 ~ 2023-11',
          invoice_url: 'https://stripe.com/invoice/inv_004',
          description: 'LexiKor Professional 월간 구독',
          payment_method: 'Visa ****1234'
        }
      ]

      setPayments(mockPayments)
    } catch (error) {
      console.error('Failed to load payment history:', error)
      message.error('결제 내역을 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = () => {
    // TODO: Load from API
    setStats({
      total_spent: 396000,
      total_payments: 4,
      current_plan: 'Professional'
    })
  }

  const handleDownloadInvoice = (record: PaymentRecord) => {
    if (record.invoice_url) {
      window.open(record.invoice_url, '_blank')
      message.success('영수증 다운로드를 시작합니다')
    } else {
      message.warning('영수증을 사용할 수 없습니다')
    }
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      paid: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      pending: <ClockCircleOutlined style={{ color: '#faad14' }} />,
      failed: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      refunded: <CloseCircleOutlined style={{ color: '#1890ff' }} />
    }
    return icons[status as keyof typeof icons] || icons.paid
  }

  const getStatusTag = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      paid: { color: 'success', text: '결제 완료' },
      pending: { color: 'processing', text: '처리 중' },
      failed: { color: 'error', text: '결제 실패' },
      refunded: { color: 'default', text: '환불됨' }
    }
    const config = statusConfig[status] || statusConfig.paid
    return <Tag color={config.color} icon={getStatusIcon(status)}>{config.text}</Tag>
  }

  const columns = [
    {
      title: '날짜',
      dataIndex: 'date',
      key: 'date',
      width: 180,
      render: (date: string) => (
        <div>
          <div><Text strong>{dayjs(date).format('YYYY년 MM월 DD일')}</Text></div>
          <div><Text type="secondary" style={{ fontSize: 12 }}>{dayjs(date).format('HH:mm')}</Text></div>
        </div>
      ),
      sorter: (a: PaymentRecord, b: PaymentRecord) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      defaultSortOrder: 'descend' as const
    },
    {
      title: '설명',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: PaymentRecord) => (
        <div>
          <div><Text strong>{text}</Text></div>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.period}
            </Text>
          </div>
          {record.payment_method && (
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.payment_method}
              </Text>
            </div>
          )}
        </div>
      )
    },
    {
      title: '플랜',
      dataIndex: 'plan',
      key: 'plan',
      width: 130,
      render: (plan: string) => <Tag color="blue">{plan}</Tag>,
      filters: [
        { text: 'Free', value: 'Free' },
        { text: 'Professional', value: 'Professional' },
        { text: 'Enterprise', value: 'Enterprise' }
      ],
      onFilter: (value: any, record: PaymentRecord) => record.plan === value
    },
    {
      title: '금액',
      dataIndex: 'amount',
      key: 'amount',
      width: 130,
      align: 'right' as const,
      render: (amount: number) => (
        <Text strong style={{ fontSize: 15 }}>₩{amount.toLocaleString()}</Text>
      ),
      sorter: (a: PaymentRecord, b: PaymentRecord) => a.amount - b.amount
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: '결제 완료', value: 'paid' },
        { text: '처리 중', value: 'pending' },
        { text: '실패', value: 'failed' },
        { text: '환불됨', value: 'refunded' }
      ],
      onFilter: (value: any, record: PaymentRecord) => record.status === value
    },
    {
      title: '작업',
      key: 'action',
      width: 140,
      render: (_: any, record: PaymentRecord) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadInvoice(record)}
            disabled={!record.invoice_url}
          >
            영수증
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Title level={2} style={{ margin: 0 }}>
                    <FileTextOutlined /> 결제 내역
                  </Title>
                  <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
                    모든 결제 내역을 확인하고 영수증을 다운로드할 수 있습니다
                  </Paragraph>
                </div>
                <Button onClick={() => navigate('/billing')}>
                  구독 관리로 이동
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Stats */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="총 결제 금액"
                value={stats.total_spent}
                suffix="원"
                prefix={<CreditCardOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="총 결제 횟수"
                value={stats.total_payments}
                suffix="건"
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="현재 플랜"
                value={stats.current_plan}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Payment History Table */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card>
              <div style={{ marginBottom: 16 }}>
                <Title level={4}>결제 기록</Title>
                <Text type="secondary">
                  최근 {payments.length}건의 결제 내역입니다. 영수증이 필요하시면 다운로드 버튼을 클릭하세요.
                </Text>
              </div>

              {payments.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={payments}
                  loading={loading}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}건`,
                    pageSizeOptions: ['10', '20', '50', '100']
                  }}
                  scroll={{ x: 1000 }}
                />
              ) : (
                <Empty
                  description="결제 내역이 없습니다"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ padding: '60px 0' }}
                >
                  <Button type="primary" onClick={() => navigate('/billing')}>
                    플랜 선택하기
                  </Button>
                </Empty>
              )}
            </Card>
          </Col>
        </Row>

        {/* Help Section */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card>
              <Title level={5}>도움말</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>영수증이 필요한가요?</Text>
                  <Paragraph type="secondary">
                    각 결제 건별로 '영수증' 버튼을 클릭하면 PDF 형식의 영수증을 다운로드할 수 있습니다.
                    영수증에는 결제 상세 정보와 세금계산서가 포함되어 있습니다.
                  </Paragraph>
                </div>
                <div>
                  <Text strong>환불은 어떻게 요청하나요?</Text>
                  <Paragraph type="secondary">
                    결제 후 7일 이내 전액 환불이 가능합니다. 환불 요청은 support@lexikor.ai로 문의하시거나
                    설정 페이지에서 직접 요청하실 수 있습니다.
                  </Paragraph>
                </div>
                <div>
                  <Text strong>결제 내역을 Excel로 내보낼 수 있나요?</Text>
                  <Paragraph type="secondary">
                    현재는 개별 영수증 다운로드만 지원됩니다. Excel 내보내기 기능은 곧 추가될 예정입니다.
                  </Paragraph>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default BillingHistory
