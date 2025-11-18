/**
 * EmailField Component
 * Reusable email input field with validation
 */

import React from 'react'
import { Form, Input } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { requiredEmailRule } from '@/utils/validators'
import type { Rule } from 'antd/es/form'

interface EmailFieldProps {
  name?: string
  label?: string
  placeholder?: string
  required?: boolean
  rules?: Rule[]
  disabled?: boolean
}

/**
 * Email input field with built-in validation
 *
 * @example
 * <EmailField name="email" label="이메일" required />
 */
export function EmailField({
  name = 'email',
  label = '이메일',
  placeholder = '이메일을 입력하세요',
  required = true,
  rules,
  disabled = false,
}: EmailFieldProps) {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules || (required ? requiredEmailRule : [])}
    >
      <Input
        prefix={<MailOutlined />}
        placeholder={placeholder}
        size="large"
        disabled={disabled}
        autoComplete="email"
      />
    </Form.Item>
  )
}
