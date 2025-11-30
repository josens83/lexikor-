/**
 * CitationCard Component
 * Collapsible card for legal citations (statutes/cases)
 *
 * @module components/chat/CitationCard
 * @lines < 80
 */

import { useState } from 'react'
import { Card, Typography, Tag, Space, Button, Tooltip } from 'antd'
import {
  BookOutlined,
  FileTextOutlined,
  DownOutlined,
  UpOutlined,
  CopyOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import { message } from 'antd'

const { Text, Paragraph } = Typography

export interface Citation {
  type: 'statute' | 'case'
  title: string
  reference: string
  content?: string
  url?: string
}

export interface CitationCardProps {
  citations: Citation[]
}

const CitationCard: React.FC<CitationCardProps> = ({ citations }) => {
  const [expanded, setExpanded] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    message.success('인용 정보가 복사되었습니다')
  }

  if (!citations || citations.length === 0) return null

  const displayCitations = expanded ? citations : citations.slice(0, 2)

  return (
    <Card
      size="small"
      style={{ marginTop: 12, background: '#fafafa' }}
      title={
        <Space>
          <BookOutlined />
          <Text strong>법률 출처 ({citations.length})</Text>
        </Space>
      }
    >
      {displayCitations.map((citation, idx) => (
        <div key={idx} style={{ marginBottom: idx < displayCitations.length - 1 ? 12 : 0 }}>
          <Space wrap>
            <Tag color={citation.type === 'statute' ? 'blue' : 'green'}>
              {citation.type === 'statute' ? '법령' : '판례'}
            </Tag>
            <Text strong>{citation.title}</Text>
            <Text type="secondary">{citation.reference}</Text>
            <Tooltip title="복사">
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => handleCopy(`${citation.title} (${citation.reference})`)}
              />
            </Tooltip>
            {citation.url && (
              <Tooltip title="원문 보기">
                <Button
                  type="text"
                  size="small"
                  icon={<LinkOutlined />}
                  onClick={() => window.open(citation.url, '_blank')}
                />
              </Tooltip>
            )}
          </Space>
          {citation.content && expanded && (
            <Paragraph
              type="secondary"
              style={{ marginTop: 4, marginBottom: 0, fontSize: 12 }}
              ellipsis={{ rows: 2, expandable: true }}
            >
              {citation.content}
            </Paragraph>
          )}
        </div>
      ))}

      {citations.length > 2 && (
        <Button
          type="link"
          size="small"
          onClick={() => setExpanded(!expanded)}
          icon={expanded ? <UpOutlined /> : <DownOutlined />}
          style={{ padding: 0, marginTop: 8 }}
        >
          {expanded ? '접기' : `${citations.length - 2}개 더 보기`}
        </Button>
      )}
    </Card>
  )
}

export default CitationCard
