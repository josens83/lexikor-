/**
 * Research Table Column Definitions
 *
 * Extracted from Research.tsx for reusability
 */

import { Button, Tag } from 'antd'
import { Typography } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Text } = Typography

/**
 * Column definitions for case table
 */
export const caseColumns = (
  onViewDetail: (id: number) => void
): ColumnsType<any> => [
  {
    title: '사건번호',
    dataIndex: 'case_number',
    key: 'case_number',
    render: (text: string) => <Text strong>{text}</Text>,
  },
  {
    title: '사건명',
    dataIndex: 'case_name',
    key: 'case_name',
    ellipsis: true,
  },
  {
    title: '법원',
    dataIndex: 'court',
    key: 'court',
    render: (text: string) => <Tag color="blue">{text}</Tag>,
  },
  {
    title: '유형',
    dataIndex: 'case_type',
    key: 'case_type',
    render: (text: string) => <Tag>{text}</Tag>,
  },
  {
    title: '선고일',
    dataIndex: 'decision_date',
    key: 'decision_date',
    render: (date: string) =>
      date ? new Date(date).toLocaleDateString('ko-KR') : '-',
  },
  {
    title: '작업',
    key: 'action',
    render: (_: any, record: any) => (
      <Button
        type="link"
        icon={<EyeOutlined />}
        onClick={() => onViewDetail(record.id)}
      >
        상세보기
      </Button>
    ),
  },
]

/**
 * Column definitions for statute table
 */
export const statuteColumns = (
  onViewDetail: (id: number) => void
): ColumnsType<any> => [
  {
    title: '법령명',
    dataIndex: 'statute_name',
    key: 'statute_name',
    render: (text: string) => <Text strong>{text}</Text>,
  },
  {
    title: '법령번호',
    dataIndex: 'statute_number',
    key: 'statute_number',
  },
  {
    title: '유형',
    dataIndex: 'statute_type',
    key: 'statute_type',
    render: (text: string) => <Tag color="green">{text}</Tag>,
  },
  {
    title: '시행일',
    dataIndex: 'effective_date',
    key: 'effective_date',
    render: (date: string) =>
      date ? new Date(date).toLocaleDateString('ko-KR') : '-',
  },
  {
    title: '상태',
    dataIndex: 'is_active',
    key: 'is_active',
    render: (isActive: boolean) => (
      <Tag color={isActive ? 'success' : 'default'}>
        {isActive ? '시행' : '폐지'}
      </Tag>
    ),
  },
  {
    title: '작업',
    key: 'action',
    render: (_: any, record: any) => (
      <Button
        type="link"
        icon={<EyeOutlined />}
        onClick={() => onViewDetail(record.id)}
      >
        상세보기
      </Button>
    ),
  },
]
