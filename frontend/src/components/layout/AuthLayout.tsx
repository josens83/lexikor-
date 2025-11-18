/**
 * AuthLayout Component
 * Common layout for authentication pages (Login, Register, ForgotPassword, etc.)
 */

import React, { ReactNode } from 'react'
import { Card } from 'antd'
import { COLORS } from '@/constants'

interface AuthLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  cardWidth?: number
  showLogo?: boolean
}

/**
 * Authentication page layout with gradient background and centered card
 *
 * @example
 * <AuthLayout title="로그인" subtitle="LexiKor에 오신 것을 환영합니다">
 *   <LoginForm />
 * </AuthLayout>
 */
export function AuthLayout({
  children,
  title,
  subtitle,
  cardWidth = 400,
  showLogo = true,
}: AuthLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: COLORS.GRADIENT_PRIMARY,
        padding: '24px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: cardWidth,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          borderRadius: '12px',
        }}
      >
        {showLogo && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 800,
                background: COLORS.GRADIENT_PRIMARY,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '8px',
              }}
            >
              LexiKor
            </div>
            <div
              style={{
                fontSize: '14px',
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              AI 기반 법률 어시스턴트
            </div>
          </div>
        )}

        {(title || subtitle) && (
          <div style={{ marginBottom: '24px' }}>
            {title && (
              <h1
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  marginBottom: '8px',
                  color: COLORS.TEXT_PRIMARY,
                }}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: '14px',
                  color: COLORS.TEXT_SECONDARY,
                  margin: 0,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </Card>
    </div>
  )
}
