/**
 * PhoneField Component
 * Reusable phone number input field with Korean phone number validation
 */

import React from 'react'
import { Form, Input } from 'antd'
import { PhoneOutlined } from '@ant-design/icons'
import { requiredPhoneRule, phoneRule } from '@/utils/validators'
import type { Rule } from 'antd/es/form'

interface PhoneFieldProps {
  name?: string
  label?: string
  placeholder?: string
  required?: boolean
  rules?: Rule[]
  disabled?: boolean
}

/**
 * Phone number input field with Korean phone number validation
 *
 * @example
 * <PhoneField name="phone" label="전화번호" required />
 */
export function PhoneField({
  name = 'phone',
  label = '전화번호',
  placeholder = '010-1234-5678',
  required = false,
  rules,
  disabled = false,
}: PhoneFieldProps) {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules || (required ? requiredPhoneRule : [phoneRule])}
    >
      <Input
        prefix={<PhoneOutlined />}
        placeholder={placeholder}
        size="large"
        disabled={disabled}
        autoComplete="tel"
        maxLength={13}
      />
    </Form.Item>
  )
}
