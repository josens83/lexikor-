/**
 * VirtualizedMessages Component
 * Virtualized message list for long conversations
 * Uses intersection observer for efficient rendering
 *
 * @module components/chat/VirtualizedMessages
 * @lines < 100
 */

import { useRef, useState, useEffect, useCallback, memo } from 'react'
import MessageBubble from './MessageBubble'
import type { Message } from '@/types'

interface VirtualizedMessagesProps {
  messages: Message[]
  onFeedback?: (messageId: number, rating: number) => Promise<void>
  overscan?: number
}

const ESTIMATED_ITEM_HEIGHT = 120 // Estimated height per message

const VirtualizedMessages: React.FC<VirtualizedMessagesProps> = memo(({
  messages,
  onFeedback,
  overscan = 5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })

  const updateVisibleRange = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const scrollTop = container.scrollTop
    const clientHeight = container.clientHeight
    const totalHeight = messages.length * ESTIMATED_ITEM_HEIGHT

    const start = Math.max(0, Math.floor(scrollTop / ESTIMATED_ITEM_HEIGHT) - overscan)
    const visibleCount = Math.ceil(clientHeight / ESTIMATED_ITEM_HEIGHT)
    const end = Math.min(messages.length, start + visibleCount + overscan * 2)

    setVisibleRange({ start, end })
  }, [messages.length, overscan])

  useEffect(() => {
    updateVisibleRange()
  }, [messages.length, updateVisibleRange])

  const handleScroll = useCallback(() => {
    requestAnimationFrame(updateVisibleRange)
  }, [updateVisibleRange])

  // For small lists, render all messages
  if (messages.length <= 50) {
    return (
      <>
        {messages.map((msg, index) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isLast={index === messages.length - 1}
            onFeedback={onFeedback}
          />
        ))}
      </>
    )
  }

  const visibleMessages = messages.slice(visibleRange.start, visibleRange.end)
  const topPadding = visibleRange.start * ESTIMATED_ITEM_HEIGHT
  const bottomPadding = (messages.length - visibleRange.end) * ESTIMATED_ITEM_HEIGHT

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {/* Top spacer */}
      <div style={{ height: topPadding }} />

      {/* Visible messages */}
      {visibleMessages.map((msg, index) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isLast={visibleRange.start + index === messages.length - 1}
          onFeedback={onFeedback}
        />
      ))}

      {/* Bottom spacer */}
      <div style={{ height: bottomPadding }} />
    </div>
  )
})

VirtualizedMessages.displayName = 'VirtualizedMessages'

export default VirtualizedMessages
