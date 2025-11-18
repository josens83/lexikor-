/**
 * Settings - Account Tab Component
 */

import { useState } from 'react'
import { Card, Space, Button, Alert, Modal } from 'antd'
import { Typography } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useDeleteAccount } from '@hooks/queries'
import { storage } from '@utils/storage'
import { ROUTES } from '@constants'
import DataExportModal from '../DataExportModal'

const { Paragraph } = Typography

export function AccountTab() {
  const [exportModalVisible, setExportModalVisible] = useState(false)
  const { mutate: deleteAccount } = useDeleteAccount()

  const handleExportData = () => {
    setExportModalVisible(true)
  }

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: '계정 삭제',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <Paragraph>정말로 계정을 삭제하시겠습니까?</Paragraph>
          <Paragraph type="danger" strong>
            이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
          </Paragraph>
        </div>
      ),
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: () => {
        deleteAccount(undefined, {
          onSuccess: () => {
            storage.clearAll()
            window.location.href = ROUTES.LOGIN
          },
        })
      },
    })
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card title="데이터 내보내기">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Paragraph>
            계정과 관련된 모든 데이터를 JSON 형식으로 내보낼 수 있습니다. 대화 내역,
            문서, 설정 등이 포함됩니다.
          </Paragraph>
          <Button onClick={handleExportData}>데이터 내보내기</Button>
        </Space>
      </Card>

      <Card title="계정 삭제">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="경고"
            description="계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다."
            type="error"
            showIcon
          />
          <Paragraph>계정을 삭제하면 다음 데이터가 모두 삭제됩니다:</Paragraph>
          <ul>
            <li>프로필 정보</li>
            <li>모든 대화 내역</li>
            <li>업로드한 문서</li>
            <li>구독 정보</li>
            <li>설정 및 환경설정</li>
          </ul>
          <Button danger onClick={handleDeleteAccount}>
            계정 삭제
          </Button>
        </Space>
      </Card>

      {/* Data Export Modal */}
      <DataExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
      />
    </Space>
  )
}
