/**
 * User Feedback & Support Widget
 *
 * Floating widget for user feedback, bug reports, and feature requests
 * Similar to Intercom, Zendesk, Helpscout
 */

import { useState } from 'react'
import {
  FloatButton,
  Modal,
  Form,
  Input,
  Select,
  Rate,
  Upload,
  Button,
  message,
  Space,
  Typography,
  Alert
} from 'antd'
import {
  CommentOutlined,
  BugOutlined,
  BulbOutlined,
  QuestionCircleOutlined,
  SendOutlined,
  UploadOutlined,
  CloseOutlined
} from '@ant-design/icons'
import type { UploadFile } from 'antd'

const { TextArea } = Input
const { Text, Title } = Typography
const { Option } = Select

interface FeedbackFormData {
  type: 'bug' | 'feature' | 'question' | 'other'
  subject: string
  message: string
  rating?: number
  email: string
  attachments?: UploadFile[]
}

const FeedbackWidget = () => {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // Get user email from localStorage or context
  const userEmail = localStorage.getItem('user_email') || ''

  const feedbackTypes = [
    {
      value: 'bug',
      label: '버그 제보',
      icon: <BugOutlined />,
      color: '#ff4d4f',
      description: '문제가 발생했거나 예상대로 작동하지 않는 기능을 보고해주세요'
    },
    {
      value: 'feature',
      label: '기능 제안',
      icon: <BulbOutlined />,
      color: '#faad14',
      description: '새로운 기능이나 개선 사항을 제안해주세요'
    },
    {
      value: 'question',
      label: '문의사항',
      icon: <QuestionCircleOutlined />,
      color: '#1890ff',
      description: '서비스 사용에 대해 궁금한 점을 문의해주세요'
    },
    {
      value: 'other',
      label: '기타',
      icon: <CommentOutlined />,
      color: '#52c41a',
      description: '기타 피드백이나 의견을 공유해주세요'
    }
  ]

  const handleSubmit = async (values: FeedbackFormData) => {
    setSubmitting(true)
    try {
      // TODO: Replace with actual API call
      // const response = await feedbackAPI.submitFeedback({
      //   ...values,
      //   attachments: fileList,
      //   user_agent: navigator.userAgent,
      //   page_url: window.location.href,
      //   timestamp: new Date().toISOString()
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      message.success({
        content: '피드백이 성공적으로 전송되었습니다. 소중한 의견 감사합니다!',
        duration: 4
      })

      // Reset form
      form.resetFields()
      setFileList([])
      setOpen(false)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      message.error('피드백 전송에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList)
  }

  return (
    <>
      <FloatButton
        icon={<CommentOutlined />}
        type="primary"
        style={{
          right: 24,
          bottom: 80,
          width: 56,
          height: 56
        }}
        tooltip="피드백 보내기"
        onClick={() => setOpen(true)}
      />

      <Modal
        title={
          <div>
            <Title level={4} style={{ marginBottom: 4 }}>
              피드백 보내기
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              여러분의 의견은 LexiKor를 더 나은 서비스로 만드는 데 큰 도움이 됩니다
            </Text>
          </div>
        }
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={600}
        closeIcon={<CloseOutlined />}
      >
        <Alert
          message="빠른 답변을 원하시나요?"
          description={
            <Space direction="vertical" size={0}>
              <Text>이메일: support@lexikor.ai</Text>
              <Text>전화: 02-1234-5678 (평일 09:00-18:00)</Text>
            </Space>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            email: userEmail,
            type: 'question'
          }}
        >
          <Form.Item
            name="type"
            label="피드백 유형"
            rules={[{ required: true, message: '피드백 유형을 선택해주세요' }]}
          >
            <Select
              size="large"
              placeholder="피드백 유형을 선택하세요"
            >
              {feedbackTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  <Space>
                    <span style={{ color: type.color }}>{type.icon}</span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{type.label}</div>
                      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
                        {type.description}
                      </div>
                    </div>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="subject"
            label="제목"
            rules={[
              { required: true, message: '제목을 입력해주세요' },
              { min: 5, message: '제목은 최소 5자 이상이어야 합니다' }
            ]}
          >
            <Input
              size="large"
              placeholder="간단히 요약해주세요 (예: 문서 업로드 시 오류 발생)"
              maxLength={100}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="message"
            label="상세 내용"
            rules={[
              { required: true, message: '내용을 입력해주세요' },
              { min: 10, message: '내용은 최소 10자 이상이어야 합니다' }
            ]}
          >
            <TextArea
              rows={6}
              placeholder="자세히 설명해주세요. 버그 제보의 경우 재현 방법을 포함해주시면 더 빠르게 해결할 수 있습니다."
              maxLength={2000}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="rating"
            label="전체적인 만족도 (선택사항)"
          >
            <Rate
              style={{ fontSize: 32 }}
              tooltips={['매우 불만족', '불만족', '보통', '만족', '매우 만족']}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="이메일"
            rules={[
              { required: true, message: '이메일을 입력해주세요' },
              { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
            ]}
          >
            <Input
              size="large"
              placeholder="답변을 받을 이메일 주소"
              type="email"
            />
          </Form.Item>

          <Form.Item
            label="첨부파일 (선택사항)"
            extra="스크린샷이나 관련 파일을 첨부하면 더 빠르게 해결할 수 있습니다 (최대 5MB)"
          >
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Prevent auto upload
              accept="image/*,.pdf,.doc,.docx"
              maxCount={3}
            >
              <Button icon={<UploadOutlined />}>파일 선택</Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={submitting}
                size="large"
              >
                피드백 보내기
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <div style={{
          marginTop: 16,
          padding: 12,
          background: '#f5f5f5',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            보내주신 피드백은 24시간 이내에 검토됩니다.
            긴급한 문제는 전화 또는 이메일로 직접 문의해주세요.
          </Text>
        </div>
      </Modal>
    </>
  )
}

export default FeedbackWidget
