import { useState, useEffect } from 'react'
import { Layout, Card, Upload, Button, Table, Tag, Space, Modal, Typography, Progress, message, Row, Col } from 'antd'
import { UploadOutlined, FileTextOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { documentsAPI } from '../services/api'

// Remove Content from Layout import as MainLayout provides it
const { Title, Text, Paragraph } = Typography

interface Document {
  id: number
  title: string
  document_type: string
  filename: string
  file_size: number
  status: string
  summary?: string
  risk_score?: number
  created_at: string
}

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [analysisModalVisible, setAnalysisModalVisible] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    setLoading(true)
    try {
      const response = await documentsAPI.getDocuments()
      setDocuments(response.data)
    } catch (error) {
      message.error('문서 목록을 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      const formData = new FormData()
      formData.append('file', file as Blob)

      try {
        const response = await documentsAPI.upload(formData)
        message.success(`파일 업로드 성공`)
        onSuccess?.(response.data)
        await loadDocuments()
      } catch (error: any) {
        message.error(error.response?.data?.detail || '업로드 실패')
        onError?.(error)
      }
    },
    accept: '.pdf,.doc,.docx,.txt,.hwp'
  }

  const handleViewAnalysis = async (doc: Document) => {
    if (doc.status !== 'COMPLETED') {
      message.warning('문서 분석이 완료되지 않았습니다')
      return
    }

    try {
      const response = await documentsAPI.analyzeDocument(doc.id)
      setAnalysisData(response.data)
      setSelectedDoc(doc)
      setAnalysisModalVisible(true)
    } catch (error) {
      message.error('분석 결과를 불러오는데 실패했습니다')
    }
  }

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '문서를 삭제하시겠습니까?',
      content: '이 작업은 되돌릴 수 없습니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: async () => {
        try {
          await documentsAPI.deleteDocument(id)
          message.success('문서가 삭제되었습니다')
          await loadDocuments()
        } catch (error) {
          message.error('문서 삭제에 실패했습니다')
        }
      }
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB'
    else return (bytes / 1048576).toFixed(2) + ' MB'
  }

  const columns = [
    {
      title: '문서명',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Document) => (
        <Space>
          <FileTextOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.filename}</Text>
          </div>
        </Space>
      )
    },
    {
      title: '유형',
      dataIndex: 'document_type',
      key: 'document_type',
      render: (type: string) => <Tag>{type}</Tag>
    },
    {
      title: '크기',
      dataIndex: 'file_size',
      key: 'file_size',
      render: (size: number) => formatFileSize(size)
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig: any = {
          UPLOADING: { color: 'processing', text: '업로드 중' },
          PROCESSING: { color: 'processing', text: '처리 중' },
          COMPLETED: { color: 'success', text: '완료' },
          FAILED: { color: 'error', text: '실패' }
        }
        const config = statusConfig[status] || {}
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: '위험도',
      dataIndex: 'risk_score',
      key: 'risk_score',
      render: (score?: number) => (
        score !== undefined && score !== null ? (
          <Space>
            <Progress
              type="circle"
              percent={score}
              width={40}
              strokeColor={score > 70 ? '#ff4d4f' : score > 30 ? '#faad14' : '#52c41a'}
            />
          </Space>
        ) : <Text type="secondary">-</Text>
      )
    },
    {
      title: '업로드 일시',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString('ko-KR')
    },
    {
      title: '작업',
      key: 'action',
      render: (_: any, record: Document) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewAnalysis(record)}
            disabled={record.status !== 'COMPLETED'}
          >
            분석
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
          >
            삭제
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={24}>
              <Card>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div>
                    <Title level={2}>문서 관리</Title>
                    <Paragraph type="secondary">
                      법률 문서를 업로드하고 AI가 자동으로 분석합니다. 계약서의 위험 조항을 식별하고 개선 사항을 제안합니다.
                    </Paragraph>
                  </div>

                  <Upload.Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                    </p>
                    <p className="ant-upload-text">클릭하거나 파일을 드래그하여 업로드</p>
                    <p className="ant-upload-hint">
                      지원 형식: PDF, DOCX, DOC, TXT, HWP (최대 50MB)
                    </p>
                  </Upload.Dragger>
                </Space>
              </Card>
            </Col>
          </Row>

          <Card title={`문서 목록`}>
            <Table
              columns={columns}
              dataSource={documents}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </div>

        <Modal
          title={<Space><FileTextOutlined /> 문서 분석 결과</Space>}
          open={analysisModalVisible}
          onCancel={() => setAnalysisModalVisible(false)}
          width={800}
          footer={[
            <Button key="close" onClick={() => setAnalysisModalVisible(false)}>
              닫기
            </Button>
          ]}
        >
          {analysisData && (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Title level={5}>문서명</Title>
                <Text>{selectedDoc?.title}</Text>
              </div>

              <div>
                <Title level={5}>요약</Title>
                <Paragraph>{analysisData.summary || '요약 정보가 없습니다.'}</Paragraph>
              </div>

              <div>
                <Title level={5}>위험도 분석</Title>
                <Progress
                  percent={analysisData.risk_score}
                  strokeColor={
                    analysisData.risk_score > 70 ? '#ff4d4f' :
                    analysisData.risk_score > 30 ? '#faad14' : '#52c41a'
                  }
                />
              </div>

              <div>
                <Title level={5}>주요 조항</Title>
                {analysisData.key_clauses && analysisData.key_clauses.length > 0 ? (
                  analysisData.key_clauses.map((clause: any, idx: number) => (
                    <Card key={idx} size="small" style={{ marginBottom: '8px' }}>
                      <Text strong>{clause.title || `조항 ${idx + 1}`}</Text>
                      <Paragraph>{clause.content}</Paragraph>
                    </Card>
                  ))
                ) : (
                  <Text type="secondary">주요 조항 정보가 없습니다.</Text>
                )}
              </div>
            </Space>
          )}
        </Modal>
    </div>
  )
}

export default Documents
