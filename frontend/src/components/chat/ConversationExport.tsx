/**
 * ConversationExport Component
 * Export conversation to various formats
 *
 * @module components/chat/ConversationExport
 * @lines < 90
 */

import { Dropdown, Button, message } from 'antd'
import type { MenuProps } from 'antd'
import { DownloadOutlined, FileTextOutlined, FilePdfOutlined } from '@ant-design/icons'
import type { Message } from '@/types'
import { MessageRole } from '@/types'

export interface ConversationExportProps {
  messages: Message[]
  conversationTitle?: string
  disabled?: boolean
}

const ConversationExport: React.FC<ConversationExportProps> = ({
  messages,
  conversationTitle = '대화 내역',
  disabled = false,
}) => {
  const formatAsText = (): string => {
    const header = `${conversationTitle}\n${'='.repeat(50)}\n내보낸 날짜: ${new Date().toLocaleString('ko-KR')}\n\n`
    const body = messages
      .map((msg) => {
        const role = msg.role === MessageRole.USER ? '사용자' : 'AI 어시스턴트'
        const time = new Date(msg.created_at).toLocaleString('ko-KR')
        return `[${role}] (${time})\n${msg.content}\n`
      })
      .join('\n---\n\n')
    return header + body
  }

  const formatAsMarkdown = (): string => {
    const header = `# ${conversationTitle}\n\n> 내보낸 날짜: ${new Date().toLocaleString('ko-KR')}\n\n---\n\n`
    const body = messages
      .map((msg) => {
        const role = msg.role === MessageRole.USER ? '**사용자**' : '**AI 어시스턴트**'
        const time = new Date(msg.created_at).toLocaleString('ko-KR')
        return `### ${role}\n_${time}_\n\n${msg.content}\n`
      })
      .join('\n---\n\n')
    return header + body
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    message.success('대화 내역이 저장되었습니다')
  }

  const handleExport = (format: 'txt' | 'md') => {
    const timestamp = new Date().toISOString().slice(0, 10)
    if (format === 'txt') {
      downloadFile(formatAsText(), `${conversationTitle}_${timestamp}.txt`, 'text/plain')
    } else {
      downloadFile(formatAsMarkdown(), `${conversationTitle}_${timestamp}.md`, 'text/markdown')
    }
  }

  const items: MenuProps['items'] = [
    {
      key: 'txt',
      label: '텍스트 파일 (.txt)',
      icon: <FileTextOutlined />,
      onClick: () => handleExport('txt'),
    },
    {
      key: 'md',
      label: '마크다운 파일 (.md)',
      icon: <FileTextOutlined />,
      onClick: () => handleExport('md'),
    },
  ]

  return (
    <Dropdown menu={{ items }} disabled={disabled || messages.length === 0}>
      <Button
        type="text"
        icon={<DownloadOutlined />}
        disabled={disabled || messages.length === 0}
      >
        내보내기
      </Button>
    </Dropdown>
  )
}

export default ConversationExport
