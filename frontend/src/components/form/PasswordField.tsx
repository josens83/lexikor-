/**
 * PasswordField Component
 * Reusable password input field with validation and strength indicator
 */

import React, { useState } from 'react'
import { Form, Input, Progress } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { requiredPasswordRule } from '@/utils/validators'
import { getPasswordStrength } from '@/utils/validators'
import type { Rule } from 'antd/es/form'

interface PasswordFieldProps {
  name?: string
  label?: string
  placeholder?: string
  required?: boolean
  rules?: Rule[]
  disabled?: boolean
  showStrengthIndicator?: boolean
  autoComplete?: string
}

/**
 * Password input field with built-in validation and optional strength indicator
 *
 * @example
 * <PasswordField name="password" label="비밀번호" showStrengthIndicator />
 */
export function PasswordField({
  name = 'password',
  label = '비밀번호',
  placeholder = '비밀번호를 입력하세요',
  required = true,
  rules,
  disabled = false,
  showStrengthIndicator = false,
  autoComplete = 'current-password',
}: PasswordFieldProps) {
  const [password, setPassword] = useState('')
  const strength = showStrengthIndicator && password
    ? getPasswordStrength(password)
    : null

  const getStrengthColor = (level: 'weak' | 'medium' | 'strong') => {
    switch (level) {
      case 'weak':
        return '#ff4d4f'
      case 'medium':
        return '#faad14'
      case 'strong':
        return '#52c41a'
    }
  }

  return (
    <>
      <Form.Item
        name={name}
        label={label}
        rules={rules || (required ? requiredPasswordRule : [])}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder={placeholder}
          size="large"
          disabled={disabled}
          autoComplete={autoComplete}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Item>

      {showStrengthIndicator && password && strength && (
        <div style={{ marginTop: '-16px', marginBottom: '16px' }}>
          <Progress
            percent={strength.score}
            size="small"
            strokeColor={getStrengthColor(strength.level)}
            showInfo={false}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {strength.feedback}
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Password confirmation field
 *
 * @example
 * <PasswordConfirmField name="confirm_password" passwordFieldName="password" />
 */
export function PasswordConfirmField({
  name = 'confirm_password',
  label = '비밀번호 확인',
  placeholder = '비밀번호를 다시 입력하세요',
  passwordFieldName = 'password',
  disabled = false,
}: Omit<PasswordFieldProps, 'showStrengthIndicator' | 'rules'> & {
  passwordFieldName?: string
}) {
  return (
    <Form.Item
      name={name}
      label={label}
      dependencies={[passwordFieldName]}
      rules={[
        { required: true, message: '비밀번호 확인을 입력해주세요' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue(passwordFieldName) === value) {
              return Promise.resolve()
            }
            return Promise.reject(new Error('비밀번호가 일치하지 않습니다'))
          },
        }),
      ]}
    >
      <Input.Password
        prefix={<LockOutlined />}
        placeholder={placeholder}
        size="large"
        disabled={disabled}
        autoComplete="new-password"
      />
    </Form.Item>
  )
}
