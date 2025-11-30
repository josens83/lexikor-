/**
 * FileAttachment Component
 * File upload with drag & drop support
 *
 * @module components/chat/FileAttachment
 * @lines < 100
 */

import { Button, Upload, List, Typography, Progress, message } from 'antd'
import type { UploadFile } from 'antd'
import {
  PaperClipOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

const { Text } = Typography

export interface AttachedFile {
  uid: string
  name: string
  size: number
  type: string
  status: 'uploading' | 'done' | 'error'
  percent?: number
  url?: string
}

export interface FileAttachmentProps {
  files: AttachedFile[]
  onFilesChange: (files: AttachedFile[]) => void
  maxFiles?: number
  maxSizeMB?: number
  acceptedTypes?: string[]
  disabled?: boolean
}

const DEFAULT_ACCEPTED = ['.pdf', '.doc', '.docx', '.txt', '.hwp']
const DEFAULT_MAX_SIZE = 10 // MB

const FileAttachment: React.FC<FileAttachmentProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = DEFAULT_MAX_SIZE,
  acceptedTypes = DEFAULT_ACCEPTED,
  disabled = false,
}) => {
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FilePdfOutlined style={{ color: '#ff4d4f' }} />
    return <FileTextOutlined style={{ color: '#1890ff' }} />
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleRemove = (uid: string) => {
    onFilesChange(files.filter((f) => f.uid !== uid))
  }

  const beforeUpload = (file: File) => {
    const isValidType = acceptedTypes.some((type) =>
      file.name.toLowerCase().endsWith(type.toLowerCase())
    )
    if (!isValidType) {
      message.error(`지원하지 않는 파일 형식입니다. (${acceptedTypes.join(', ')})`)
      return Upload.LIST_IGNORE
    }

    const isValidSize = file.size / 1024 / 1024 < maxSizeMB
    if (!isValidSize) {
      message.error(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`)
      return Upload.LIST_IGNORE
    }

    if (files.length >= maxFiles) {
      message.error(`최대 ${maxFiles}개의 파일만 첨부할 수 있습니다.`)
      return Upload.LIST_IGNORE
    }

    return false // Prevent auto-upload
  }

  const handleChange = (info: { fileList: UploadFile[] }) => {
    const newFiles: AttachedFile[] = info.fileList.map((f) => ({
      uid: f.uid,
      name: f.name,
      size: f.size || 0,
      type: f.type || '',
      status: 'done' as const,
    }))
    onFilesChange(newFiles)
  }

  return (
    <div>
      <Upload.Dragger
        multiple
        fileList={files as any}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        accept={acceptedTypes.join(',')}
        disabled={disabled || files.length >= maxFiles}
        showUploadList={false}
        style={{ padding: 8 }}
      >
        <p style={{ margin: 0 }}>
          <PaperClipOutlined style={{ marginRight: 8 }} />
          파일을 드래그하거나 클릭하여 첨부 ({files.length}/{maxFiles})
        </p>
      </Upload.Dragger>

      {files.length > 0 && (
        <List
          size="small"
          style={{ marginTop: 8 }}
          dataSource={files}
          renderItem={(file) => (
            <List.Item
              key={file.uid}
              actions={[
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemove(file.uid)}
                  disabled={disabled}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={getFileIcon(file.type)}
                title={<Text ellipsis style={{ maxWidth: 200 }}>{file.name}</Text>}
                description={formatSize(file.size)}
              />
              {file.status === 'uploading' && (
                <Progress percent={file.percent} size="small" style={{ width: 100 }} />
              )}
            </List.Item>
          )}
        />
      )}
    </div>
  )
}

export default FileAttachment
