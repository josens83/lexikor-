/**
 * Settings - Notifications Tab Component
 */

import { useState } from 'react'
import { Card, Space, Switch, Button, Divider, message } from 'antd'
import { Typography } from 'antd'

const { Text, Title } = Typography

interface NotificationSettings {
  email_notifications: boolean
  chat_notifications: boolean
  document_notifications: boolean
  marketing_emails: boolean
}

export function NotificationsTab() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    chat_notifications: true,
    document_notifications: true,
    marketing_emails: false,
  })

  const handleSave = () => {
    // TODO: Implement save to backend
    message.success('알림 설정이 저장되었습니다')
  }

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title level={5}>이메일 알림</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <div>
                <Text strong>채팅 알림</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  새로운 AI 응답이 도착하면 이메일을 받습니다
                </Text>
              </div>
              <Switch
                checked={settings.chat_notifications}
                onChange={(checked) =>
                  setSettings({ ...settings, chat_notifications: checked })
                }
              />
            </Space>

            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <div>
                <Text strong>문서 처리 알림</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  문서 분석이 완료되면 이메일을 받습니다
                </Text>
              </div>
              <Switch
                checked={settings.document_notifications}
                onChange={(checked) =>
                  setSettings({ ...settings, document_notifications: checked })
                }
              />
            </Space>

            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <div>
                <Text strong>마케팅 이메일</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  새로운 기능 및 프로모션 정보를 받습니다
                </Text>
              </div>
              <Switch
                checked={settings.marketing_emails}
                onChange={(checked) =>
                  setSettings({ ...settings, marketing_emails: checked })
                }
              />
            </Space>
          </Space>
        </div>

        <Divider />

        <Button type="primary" onClick={handleSave}>
          설정 저장
        </Button>
      </Space>
    </Card>
  )
}
