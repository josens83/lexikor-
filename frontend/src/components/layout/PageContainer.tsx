/**
 * PageContainer Component
 * Common container for all page content with consistent padding and max-width
 */

import React, { ReactNode, CSSProperties } from 'react'
import { UI, COLORS } from '@/constants'

interface PageContainerProps {
  children: ReactNode
  maxWidth?: number
  padding?: number | string
  background?: string
  className?: string
  style?: CSSProperties
  fullHeight?: boolean
}

/**
 * Container component for page content with consistent styling
 *
 * @example
 * <PageContainer>
 *   <h1>Dashboard</h1>
 *   <YourContent />
 * </PageContainer>
 */
export function PageContainer({
  children,
  maxWidth = UI.MAX_CONTENT_WIDTH,
  padding = 24,
  background = COLORS.BG_SECONDARY,
  className,
  style,
  fullHeight = true,
}: PageContainerProps) {
  return (
    <div
      className={className}
      style={{
        padding: typeof padding === 'number' ? `${padding}px` : padding,
        background,
        minHeight: fullHeight ? `calc(100vh - ${UI.HEADER_HEIGHT}px)` : 'auto',
        ...style,
      }}
    >
      <div
        style={{
          maxWidth,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * Compact version with white background (for forms, settings, etc.)
 */
export function PageContainerCompact({
  children,
  maxWidth = 800,
  ...props
}: PageContainerProps) {
  return (
    <PageContainer
      maxWidth={maxWidth}
      background={COLORS.BG_PRIMARY}
      {...props}
    >
      {children}
    </PageContainer>
  )
}
