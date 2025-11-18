/**
 * User Management - Admin Interface
 *
 * Comprehensive user management interface for administrators
 * Similar to Firebase Auth, AWS IAM, Stripe Customer Management
 */

import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  DatePicker,
  Typography,
  Dropdown,
  message,
  Drawer,
  Descriptions,
  Statistic,
  Row,
  Col,
  Alert,
  Badge,
  Tooltip
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  MailOutlined,
  EyeOutlined,
  DownloadOutlined,
  FilterOutlined,
  MoreOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { MenuProps } from 'antd'
import dayjs from 'dayjs'

const { Search } = Input
const { Option } = Select
const { Title, Text } = Typography

interface User {
  id: string
  email: string
  name: string
  plan: 'Free' | 'Professional' | 'Enterprise'
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  is_verified: boolean
  created_at: string
  last_login: string | null
  total_documents: number
  total_queries: number
  total_spent: number
  phone?: string
  company?: string
}

const UserManagement = () => {
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  // Mock user data
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'john@company.com',
      name: '김철수',
      plan: 'Enterprise',
      status: 'active',
      is_verified: true,
      created_at: '2025-10-15T10:30:00',
      last_login: '2025-11-18T16:45:00',
      total_documents: 145,
      total_queries: 1230,
      total_spent: 5500000,
      phone: '010-1234-5678',
      company: '테크 컴퍼니'
    },
    {
      id: '2',
      email: 'sarah@startup.com',
      name: '이영희',
      plan: 'Professional',
      status: 'active',
      is_verified: true,
      created_at: '2025-11-01T09:15:00',
      last_login: '2025-11-18T16:20:00',
      total_documents: 45,
      total_queries: 320,
      total_spent: 299000,
      company: '스타트업 랩'
    },
    {
      id: '3',
      email: 'mike@law.com',
      name: '박민수',
      plan: 'Free',
      status: 'active',
      is_verified: true,
      created_at: '2025-11-17T18:00:00',
      last_login: '2025-11-18T10:30:00',
      total_documents: 3,
      total_queries: 15,
      total_spent: 0,
      company: '법률사무소'
    },
    {
      id: '4',
      email: 'jane@business.com',
      name: '최지은',
      plan: 'Professional',
      status: 'inactive',
      is_verified: false,
      created_at: '2025-11-10T14:20:00',
      last_login: null,
      total_documents: 0,
      total_queries: 0,
      total_spent: 0
    },
    {
      id: '5',
      email: 'bob@corp.com',
      name: '정대호',
      plan: 'Enterprise',
      status: 'suspended',
      is_verified: true,
      created_at: '2025-09-05T11:00:00',
      last_login: '2025-11-15T09:30:00',
      total_documents: 89,
      total_queries: 567,
      total_spent: 3200000,
      company: '대기업 Corp'
    }
  ]

  const [users, setUsers] = useState<User[]>(mockUsers)

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setDrawerVisible(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      plan: user.plan,
      status: user.status,
      phone: user.phone,
      company: user.company
    })
    setModalVisible(true)
  }

  const handleSuspendUser = (userId: string) => {
    Modal.confirm({
      title: '사용자 정지',
      content: '정말로 이 사용자를 정지하시겠습니까?',
      okText: '정지',
      okType: 'danger',
      cancelText: '취소',
      onOk: () => {
        message.success('사용자가 정지되었습니다')
        // TODO: API call to suspend user
      }
    })
  }

  const handleDeleteUser = (userId: string) => {
    Modal.confirm({
      title: '사용자 삭제',
      content: '정말로 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: () => {
        message.success('사용자가 삭제되었습니다')
        setUsers(users.filter(u => u.id !== userId))
      }
    })
  }

  const handleSendEmail = (user: User) => {
    message.info(`${user.email}로 이메일을 전송합니다`)
    // TODO: Implement email sending
  }

  const handleExportUsers = () => {
    message.success('사용자 데이터를 내보내는 중입니다')
    // TODO: Implement CSV export
  }

  const getActionMenuItems = (user: User): MenuProps['items'] => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: '상세 보기',
      onClick: () => handleViewUser(user)
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '수정',
      onClick: () => handleEditUser(user)
    },
    {
      key: 'email',
      icon: <MailOutlined />,
      label: '이메일 보내기',
      onClick: () => handleSendEmail(user)
    },
    {
      type: 'divider'
    },
    {
      key: 'suspend',
      icon: user.status === 'suspended' ? <UnlockOutlined /> : <LockOutlined />,
      label: user.status === 'suspended' ? '정지 해제' : '정지',
      onClick: () => handleSuspendUser(user.id)
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '삭제',
      danger: true,
      onClick: () => handleDeleteUser(user.id)
    }
  ]

  const columns: ColumnsType<User> = [
    {
      title: '사용자',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 200,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            {text}
            {record.is_verified && (
              <Tooltip title="인증됨">
                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 14 }} />
              </Tooltip>
            )}
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          {record.company && (
            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
              {record.company}
            </Text>
          )}
        </div>
      ),
      filterable: true,
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: '플랜',
      dataIndex: 'plan',
      key: 'plan',
      width: 120,
      render: (plan) => {
        const colors: Record<string, string> = {
          'Enterprise': 'purple',
          'Professional': 'blue',
          'Free': 'default'
        }
        return <Tag color={colors[plan]}>{plan}</Tag>
      },
      filters: [
        { text: 'Enterprise', value: 'Enterprise' },
        { text: 'Professional', value: 'Professional' },
        { text: 'Free', value: 'Free' }
      ],
      onFilter: (value, record) => record.plan === value
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const config: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
          'active': { color: 'success', text: '활성', icon: <CheckCircleOutlined /> },
          'inactive': { color: 'default', text: '비활성', icon: <CloseCircleOutlined /> },
          'suspended': { color: 'error', text: '정지', icon: <LockOutlined /> },
          'pending': { color: 'processing', text: '대기', icon: <CloseCircleOutlined /> }
        }
        return (
          <Tag icon={config[status].icon} color={config[status].color}>
            {config[status].text}
          </Tag>
        )
      },
      filters: [
        { text: '활성', value: 'active' },
        { text: '비활성', value: 'inactive' },
        { text: '정지', value: 'suspended' },
        { text: '대기', value: 'pending' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: '가입일',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix()
    },
    {
      title: '마지막 로그인',
      dataIndex: 'last_login',
      key: 'last_login',
      width: 150,
      render: (date) => date ? dayjs(date).fromNow() : '-',
      sorter: (a, b) => {
        if (!a.last_login) return 1
        if (!b.last_login) return -1
        return dayjs(a.last_login).unix() - dayjs(b.last_login).unix()
      }
    },
    {
      title: '사용량',
      key: 'usage',
      width: 150,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>문서: {record.total_documents}</div>
          <div>쿼리: {record.total_queries}</div>
        </div>
      )
    },
    {
      title: '총 결제',
      dataIndex: 'total_spent',
      key: 'total_spent',
      width: 120,
      render: (amount) => `₩${amount.toLocaleString()}`,
      sorter: (a, b) => a.total_spent - b.total_spent
    },
    {
      title: '작업',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewUser(record)}
          >
            보기
          </Button>
          <Dropdown menu={{ items: getActionMenuItems(record) }} trigger={['click']}>
            <Button type="text" size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ]

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchText ||
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchText.toLowerCase())

    const matchesPlan = selectedPlan === 'all' || user.plan === selectedPlan
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus

    return matchesSearch && matchesPlan && matchesStatus
  })

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>사용자 관리</Title>
        <Text type="secondary">전체 사용자를 관리하고 모니터링합니다</Text>
      </div>

      {/* Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="총 사용자"
              value={users.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="활성 사용자"
              value={users.filter(u => u.status === 'active').length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Enterprise"
              value={users.filter(u => u.plan === 'Enterprise').length}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="총 수익"
              value={users.reduce((sum, u) => sum + u.total_spent, 0)}
              prefix="₩"
              precision={0}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Space wrap>
            <Search
              placeholder="이름, 이메일, 회사로 검색"
              allowClear
              style={{ width: 300 }}
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              value={selectedPlan}
              onChange={setSelectedPlan}
              style={{ width: 150 }}
            >
              <Option value="all">모든 플랜</Option>
              <Option value="Enterprise">Enterprise</Option>
              <Option value="Professional">Professional</Option>
              <Option value="Free">Free</Option>
            </Select>
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: 120 }}
            >
              <Option value="all">모든 상태</Option>
              <Option value="active">활성</Option>
              <Option value="inactive">비활성</Option>
              <Option value="suspended">정지</Option>
            </Select>
          </Space>

          <Space>
            <Button icon={<DownloadOutlined />} onClick={handleExportUsers}>
              내보내기
            </Button>
            <Button type="primary" icon={<PlusOutlined />}>
              사용자 추가
            </Button>
          </Space>
        </Space>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `총 ${total}명`
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* User Detail Drawer */}
      <Drawer
        title="사용자 상세 정보"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedUser && (
          <div>
            <Alert
              message={`플랜: ${selectedUser.plan}`}
              type={selectedUser.status === 'active' ? 'success' : 'warning'}
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Descriptions column={1} bordered>
              <Descriptions.Item label="이름">{selectedUser.name}</Descriptions.Item>
              <Descriptions.Item label="이메일">{selectedUser.email}</Descriptions.Item>
              <Descriptions.Item label="전화">{selectedUser.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="회사">{selectedUser.company || '-'}</Descriptions.Item>
              <Descriptions.Item label="플랜">
                <Tag color={selectedUser.plan === 'Enterprise' ? 'purple' : 'blue'}>
                  {selectedUser.plan}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="상태">
                <Badge
                  status={selectedUser.status === 'active' ? 'success' : 'default'}
                  text={selectedUser.status}
                />
              </Descriptions.Item>
              <Descriptions.Item label="인증">
                {selectedUser.is_verified ? '완료' : '미완료'}
              </Descriptions.Item>
              <Descriptions.Item label="가입일">
                {dayjs(selectedUser.created_at).format('YYYY-MM-DD HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="마지막 로그인">
                {selectedUser.last_login ? dayjs(selectedUser.last_login).format('YYYY-MM-DD HH:mm') : '-'}
              </Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>
              사용 통계
            </Title>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="문서" value={selectedUser.total_documents} />
              </Col>
              <Col span={8}>
                <Statistic title="쿼리" value={selectedUser.total_queries} />
              </Col>
              <Col span={8}>
                <Statistic
                  title="총 결제"
                  value={selectedUser.total_spent}
                  prefix="₩"
                  precision={0}
                />
              </Col>
            </Row>

            <Space style={{ marginTop: 24, width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => handleEditUser(selectedUser)}>
                수정
              </Button>
              <Button type="primary" onClick={() => handleSendEmail(selectedUser)}>
                이메일 보내기
              </Button>
            </Space>
          </div>
        )}
      </Drawer>

      {/* Edit User Modal */}
      <Modal
        title="사용자 수정"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="저장"
        cancelText="취소"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            message.success('사용자 정보가 업데이트되었습니다')
            setModalVisible(false)
            // TODO: API call to update user
          }}
        >
          <Form.Item name="name" label="이름" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="이메일" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="전화">
            <Input />
          </Form.Item>
          <Form.Item name="company" label="회사">
            <Input />
          </Form.Item>
          <Form.Item name="plan" label="플랜" rules={[{ required: true }]}>
            <Select>
              <Option value="Free">Free</Option>
              <Option value="Professional">Professional</Option>
              <Option value="Enterprise">Enterprise</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="상태" rules={[{ required: true }]}>
            <Select>
              <Option value="active">활성</Option>
              <Option value="inactive">비활성</Option>
              <Option value="suspended">정지</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserManagement
