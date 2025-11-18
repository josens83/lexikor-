/**
 * Settings - Profile Tab Component
 */

import { Card, Row, Col, Form, Input, Button, Divider } from 'antd'
import { SafetyOutlined } from '@ant-design/icons'
import { useCurrentUser, useUpdateProfile } from '@hooks/queries'
import { EmailField } from '@components/form'
import type { User } from '@types'

export function ProfileTab() {
  const { data: profile, isLoading } = useCurrentUser()
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile()

  const [form] = Form.useForm()

  // Set form values when profile loads
  React.useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
      })
    }
  }, [profile, form])

  const handleSubmit = (values: any) => {
    updateProfile(values)
  }

  if (isLoading) {
    return <Card loading />
  }

  return (
    <Card>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="full_name"
              label="이름"
              rules={[{ required: true, message: '이름을 입력하세요' }]}
            >
              <Input size="large" placeholder="홍길동" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <EmailField
              name="email"
              label="이메일"
              disabled
              suffix={
                profile?.is_verified && (
                  <SafetyOutlined style={{ color: '#52c41a' }} />
                )
              }
            />
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="phone" label="전화번호">
              <Input size="large" placeholder="010-1234-5678" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="역할">
              <Input size="large" value={profile?.role} disabled />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Button type="primary" htmlType="submit" loading={isSaving} size="large">
          프로필 저장
        </Button>
      </Form>
    </Card>
  )
}

// Fix: Add React import
import React from 'react'
