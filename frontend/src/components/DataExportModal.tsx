/**
 * Data Export Modal Component
 *
 * Comprehensive data export functionality for GDPR compliance
 * Similar to Google Takeout, Facebook Download Your Information
 */

import { useState } from 'react'
import {
  Modal,
  Checkbox,
  Space,
  Typography,
  Alert,
  Button,
  Progress,
  List,
  Tag,
  Divider,
  Radio,
  message
} from 'antd'
import {
  DownloadOutlined,
  FileZipOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

const { Title, Text, Paragraph } = Typography

interface DataCategory {
  id: string
  name: string
  description: string
  size: string
  estimatedTime: string
  icon: React.ReactNode
}

interface DataExportModalProps {
  visible: boolean
  onClose: () => void
}

const DataExportModal = ({ visible, onClose }: DataExportModalProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'pdf'>('json')
  const [exporting, setExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportComplete, setExportComplete] = useState(false)

  // Data categories available for export
  const dataCategories: DataCategory[] = [
    {
      id: 'profile',
      name: '프로필 정보',
      description: '이름, 이메일, 전화번호 등 개인 정보',
      size: '< 1 MB',
      estimatedTime: '< 1분',
      icon: <InfoCircleOutlined />
    },
    {
      id: 'documents',
      name: '업로드한 문서',
      description: '분석한 모든 법률 문서 및 계약서',
      size: '~250 MB',
      estimatedTime: '3-5분',
      icon: <FileZipOutlined />
    },
    {
      id: 'chat_history',
      name: 'AI 채팅 기록',
      description: 'AI 법률 상담 채팅 대화 내역',
      size: '~15 MB',
      estimatedTime: '1-2분',
      icon: <InfoCircleOutlined />
    },
    {
      id: 'research_history',
      name: '법률 검색 기록',
      description: '판례 및 법령 검색 기록',
      size: '~5 MB',
      estimatedTime: '< 1분',
      icon: <InfoCircleOutlined />
    },
    {
      id: 'templates',
      name: '생성한 템플릿',
      description: '작성한 문서 템플릿',
      size: '~10 MB',
      estimatedTime: '1분',
      icon: <FileZipOutlined />
    },
    {
      id: 'billing',
      name: '결제 내역',
      description: '구독 및 결제 정보',
      size: '< 1 MB',
      estimatedTime: '< 1분',
      icon: <InfoCircleOutlined />
    },
    {
      id: 'activity_logs',
      name: '활동 로그',
      description: '로그인 기록 및 서비스 사용 기록',
      size: '~2 MB',
      estimatedTime: '< 1분',
      icon: <ClockCircleOutlined />
    }
  ]

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
    }
  }

  const handleSelectAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setSelectedCategories(dataCategories.map(c => c.id))
    } else {
      setSelectedCategories([])
    }
  }

  const calculateTotalSize = () => {
    const selected = dataCategories.filter(c => selectedCategories.includes(c.id))
    // Simple sum for demo (in real implementation, parse size strings properly)
    return selected.length > 0 ? '~280 MB' : '0 MB'
  }

  const calculateEstimatedTime = () => {
    const selected = dataCategories.filter(c => selectedCategories.includes(c.id))
    if (selected.length === 0) return '0분'
    if (selected.some(c => c.id === 'documents')) return '3-5분'
    return '1-2분'
  }

  const handleStartExport = async () => {
    if (selectedCategories.length === 0) {
      message.warning('내보낼 데이터를 선택해주세요')
      return
    }

    setExporting(true)
    setExportProgress(0)

    // Simulate export process
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setExporting(false)
          setExportComplete(true)
          message.success('데이터 내보내기가 완료되었습니다!')
          return 100
        }
        return prev + 10
      })
    }, 500)

    // TODO: Replace with actual API call
    // const response = await exportUserData({
    //   categories: selectedCategories,
    //   format: exportFormat
    // })
  }

  const handleDownload = () => {
    message.success('다운로드를 시작합니다')
    // TODO: Implement actual download
    setTimeout(() => {
      handleReset()
      onClose()
    }, 1000)
  }

  const handleReset = () => {
    setSelectedCategories([])
    setExportFormat('json')
    setExporting(false)
    setExportProgress(0)
    setExportComplete(false)
  }

  const handleClose = () => {
    if (!exporting) {
      handleReset()
      onClose()
    }
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <DownloadOutlined />
          <span>데이터 내보내기</span>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      width={700}
      footer={
        exportComplete ? (
          <Space>
            <Button onClick={handleReset}>다시 내보내기</Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
              다운로드
            </Button>
          </Space>
        ) : (
          <Space>
            <Button onClick={handleClose} disabled={exporting}>
              취소
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleStartExport}
              loading={exporting}
              disabled={selectedCategories.length === 0}
            >
              내보내기 시작
            </Button>
          </Space>
        )
      }
    >
      {!exportComplete ? (
        <>
          {/* Info Alert */}
          <Alert
            message="개인정보 보호 (GDPR 준수)"
            description="내보낸 데이터에는 LexiKor에 저장된 모든 개인 정보가 포함됩니다. 데이터는 암호화되어 다운로드되며, 24시간 후 자동으로 삭제됩니다."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            style={{ marginBottom: 24 }}
          />

          {exporting ? (
            /* Export Progress */
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Title level={4}>데이터를 준비하고 있습니다...</Title>
              <Progress
                percent={exportProgress}
                status="active"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068'
                }}
                style={{ marginTop: 24 }}
              />
              <Paragraph type="secondary" style={{ marginTop: 16 }}>
                선택한 데이터를 수집하고 압축하는 중입니다.
                <br />
                이 과정은 데이터 크기에 따라 몇 분이 소요될 수 있습니다.
              </Paragraph>
            </div>
          ) : (
            <>
              {/* Select All */}
              <div style={{ marginBottom: 16 }}>
                <Checkbox
                  onChange={handleSelectAll}
                  checked={selectedCategories.length === dataCategories.length}
                  indeterminate={selectedCategories.length > 0 && selectedCategories.length < dataCategories.length}
                >
                  <Text strong>모두 선택</Text>
                </Checkbox>
              </div>

              {/* Data Categories */}
              <List
                size="small"
                dataSource={dataCategories}
                renderItem={(category) => (
                  <List.Item
                    style={{
                      padding: '12px 16px',
                      background: selectedCategories.includes(category.id) ? '#f0f5ff' : 'transparent',
                      border: '1px solid #f0f0f0',
                      borderRadius: 8,
                      marginBottom: 8,
                      cursor: 'pointer'
                    }}
                    onClick={() => handleCategoryChange(category.id, !selectedCategories.includes(category.id))}
                  >
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Space direction="vertical" size={0}>
                        <Text strong>{category.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {category.description}
                        </Text>
                      </Space>
                    </Checkbox>
                    <Space>
                      <Tag>{category.size}</Tag>
                      <Tag icon={<ClockCircleOutlined />}>{category.estimatedTime}</Tag>
                    </Space>
                  </List.Item>
                )}
              />

              <Divider />

              {/* Export Format */}
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>
                  내보내기 형식
                </Text>
                <Radio.Group
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <Space direction="vertical">
                    <Radio value="json">
                      <Space>
                        <Text>JSON</Text>
                        <Tag color="blue">권장</Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          개발자 친화적, 구조화된 데이터
                        </Text>
                      </Space>
                    </Radio>
                    <Radio value="csv">
                      <Space>
                        <Text>CSV</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Excel에서 열기 가능
                        </Text>
                      </Space>
                    </Radio>
                    <Radio value="pdf">
                      <Space>
                        <Text>PDF</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          읽기 쉬운 문서 형식
                        </Text>
                      </Space>
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>

              {/* Summary */}
              <Alert
                message="요약"
                description={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>선택한 항목:</Text>
                      <Text strong>{selectedCategories.length}개</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>예상 크기:</Text>
                      <Text strong>{calculateTotalSize()}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>예상 시간:</Text>
                      <Text strong>{calculateEstimatedTime()}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>형식:</Text>
                      <Text strong>{exportFormat.toUpperCase()}</Text>
                    </div>
                  </Space>
                }
                type="info"
                showIcon
              />
            </>
          )}
        </>
      ) : (
        /* Export Complete */
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 24 }} />
          <Title level={3}>데이터 내보내기 완료!</Title>
          <Paragraph>
            데이터가 성공적으로 준비되었습니다.
            <br />
            다운로드 버튼을 클릭하여 파일을 다운로드하세요.
          </Paragraph>

          <Alert
            message={
              <Space>
                <WarningOutlined />
                <Text>이 링크는 24시간 후에 만료됩니다</Text>
              </Space>
            }
            type="warning"
            style={{ marginTop: 24 }}
          />

          <div style={{
            marginTop: 24,
            padding: 16,
            background: '#f5f5f5',
            borderRadius: 8
          }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">파일 이름:</Text>
                <Text strong>lexikor-export-{new Date().toISOString().split('T')[0]}.zip</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">파일 크기:</Text>
                <Text strong>{calculateTotalSize()}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">생성 시간:</Text>
                <Text strong>{new Date().toLocaleString('ko-KR')}</Text>
              </div>
            </Space>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default DataExportModal
