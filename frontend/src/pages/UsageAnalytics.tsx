/**
 * Usage Analytics Page with Charts
 *
 * Visual analytics dashboard showing user's usage patterns
 * Similar to Notion Analytics, GitHub Insights, Slack Analytics
 */

import { useState, useEffect } from 'react'
import { Card, Row, Col, Typography, DatePicker, Select, Space, Statistic, Tag, Spin } from 'antd'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import {
  RiseOutlined,
  FallOutlined,
  MessageOutlined,
  FileTextOutlined,
  SearchOutlined,
  FormOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text, Paragraph } = Typography
const { RangePicker } = DatePicker

interface UsageData {
  date: string
  queries: number
  documents: number
  research: number
  templates: number
}

interface Stats {
  total_queries: number
  total_documents: number
  total_research: number
  total_templates: number
  avg_daily_queries: number
  most_used_feature: string
  trend: 'up' | 'down' | 'stable'
  trend_percentage: number
}

const UsageAnalytics = () => {
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'custom'>('30d')
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const [usageData, setUsageData] = useState<UsageData[]>([])
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    loadUsageData()
  }, [period, dateRange])

  const loadUsageData = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      // const response = await analyticsAPI.getUsageAnalytics({ period, dateRange })
      // setUsageData(response.data.usage)
      // setStats(response.data.stats)

      // Mock data for visualization
      const mockData: UsageData[] = []
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90

      for (let i = days - 1; i >= 0; i--) {
        mockData.push({
          date: dayjs().subtract(i, 'day').format('MM/DD'),
          queries: Math.floor(Math.random() * 50) + 10,
          documents: Math.floor(Math.random() * 10) + 2,
          research: Math.floor(Math.random() * 20) + 5,
          templates: Math.floor(Math.random() * 8) + 1
        })
      }

      setUsageData(mockData)

      // Calculate stats
      const totalQueries = mockData.reduce((sum, d) => sum + d.queries, 0)
      const totalDocuments = mockData.reduce((sum, d) => sum + d.documents, 0)
      const totalResearch = mockData.reduce((sum, d) => sum + d.research, 0)
      const totalTemplates = mockData.reduce((sum, d) => sum + d.templates, 0)

      setStats({
        total_queries: totalQueries,
        total_documents: totalDocuments,
        total_research: totalResearch,
        total_templates: totalTemplates,
        avg_daily_queries: Math.round(totalQueries / days),
        most_used_feature: 'AI 채팅',
        trend: 'up',
        trend_percentage: 15.3
      })
    } catch (error) {
      console.error('Failed to load usage data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Pie chart data
  const pieData = stats ? [
    { name: 'AI 쿼리', value: stats.total_queries, color: '#1890ff' },
    { name: '문서 분석', value: stats.total_documents, color: '#52c41a' },
    { name: '법률 검색', value: stats.total_research, color: '#faad14' },
    { name: '템플릿', value: stats.total_templates, color: '#722ed1' }
  ] : []

  const COLORS = ['#1890ff', '#52c41a', '#faad14', '#722ed1']

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <Title level={2} style={{ marginBottom: 8 }}>사용량 분석</Title>
                  <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    LexiKor 사용 패턴과 통계를 확인하세요
                  </Paragraph>
                </div>
                <Space>
                  <Select
                    value={period}
                    onChange={(value) => setPeriod(value)}
                    style={{ width: 120 }}
                    options={[
                      { label: '최근 7일', value: '7d' },
                      { label: '최근 30일', value: '30d' },
                      { label: '최근 90일', value: '90d' },
                      { label: '사용자 지정', value: 'custom' }
                    ]}
                  />
                  {period === 'custom' && (
                    <RangePicker
                      value={dateRange}
                      onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                    />
                  )}
                </Space>
              </div>
            </Card>
          </Col>
        </Row>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" tip="데이터 로딩 중..." />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="총 AI 쿼리"
                    value={stats?.total_queries || 0}
                    prefix={<MessageOutlined />}
                    suffix={
                      stats && (
                        <Tag color={stats.trend === 'up' ? 'success' : 'error'} style={{ marginLeft: 8 }}>
                          {stats.trend === 'up' ? <RiseOutlined /> : <FallOutlined />}
                          {stats.trend_percentage}%
                        </Tag>
                      )
                    }
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    일평균 {stats?.avg_daily_queries || 0}회
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="문서 분석"
                    value={stats?.total_documents || 0}
                    prefix={<FileTextOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="법률 검색"
                    value={stats?.total_research || 0}
                    prefix={<SearchOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="템플릿 생성"
                    value={stats?.total_templates || 0}
                    prefix={<FormOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Charts */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              {/* Line Chart - Trend Over Time */}
              <Col xs={24} lg={16}>
                <Card title="사용량 추이">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={usageData}>
                      <defs>
                        <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="queries"
                        stroke="#1890ff"
                        fillOpacity={1}
                        fill="url(#colorQueries)"
                        name="AI 쿼리"
                      />
                      <Line
                        type="monotone"
                        dataKey="documents"
                        stroke="#52c41a"
                        name="문서 분석"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              {/* Pie Chart - Feature Distribution */}
              <Col xs={24} lg={8}>
                <Card title="기능별 사용 비율">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            {/* Bar Chart - Feature Comparison */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="일별 기능 사용량">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={usageData.slice(-14)}> {/* Last 14 days */}
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="queries" fill="#1890ff" name="AI 쿼리" />
                      <Bar dataKey="documents" fill="#52c41a" name="문서 분석" />
                      <Bar dataKey="research" fill="#faad14" name="법률 검색" />
                      <Bar dataKey="templates" fill="#722ed1" name="템플릿" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            {/* Insights */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="💡 인사이트">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>가장 많이 사용한 기능:</Text>
                      <Text style={{ marginLeft: 8 }}>{stats?.most_used_feature}</Text>
                    </div>
                    <div>
                      <Text strong>사용 트렌드:</Text>
                      <Tag color={stats?.trend === 'up' ? 'success' : 'error'} style={{ marginLeft: 8 }}>
                        {stats?.trend === 'up' ? '증가' : '감소'} {stats?.trend_percentage}%
                      </Tag>
                    </div>
                    <div>
                      <Text type="secondary">
                        지난 {period === '7d' ? '7일' : period === '30d' ? '30일' : '90일'} 동안
                        총 {(stats?.total_queries || 0) + (stats?.total_documents || 0) + (stats?.total_research || 0) + (stats?.total_templates || 0)}개의
                        작업을 수행했습니다.
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </div>
    </div>
  )
}

export default UsageAnalytics
