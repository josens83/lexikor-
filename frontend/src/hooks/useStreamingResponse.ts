/**
 * useStreamingResponse Hook
 * Handle SSE (Server-Sent Events) for streaming AI responses
 *
 * @module hooks/useStreamingResponse
 */

import { useState, useCallback, useRef } from 'react'

interface StreamingState {
  content: string
  isStreaming: boolean
  error: Error | null
  conversationId: number | null
  messageId: number | null
}

interface UseStreamingResponseOptions {
  onComplete?: (content: string, conversationId: number, messageId: number) => void
  onError?: (error: Error) => void
}

const API_BASE = import.meta.env.VITE_API_URL || ''

export function useStreamingResponse(options: UseStreamingResponseOptions = {}) {
  const [state, setState] = useState<StreamingState>({
    content: '',
    isStreaming: false,
    error: null,
    conversationId: null,
    messageId: null,
  })

  const abortControllerRef = useRef<AbortController | null>(null)

  const startStreaming = useCallback(
    async (message: string, conversationId?: number | null, legalArea?: string | null) => {
      // Abort any existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()

      setState({
        content: '',
        isStreaming: true,
        error: null,
        conversationId: null,
        messageId: null,
      })

      try {
        const token = localStorage.getItem('access_token')
        const response = await fetch(`${API_BASE}/api/v1/chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message,
            conversation_id: conversationId,
            legal_area: legalArea,
            stream: true,
          }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('Response body is not readable')
        }

        const decoder = new TextDecoder()
        let accumulatedContent = ''
        let finalConversationId: number | null = null
        let finalMessageId: number | null = null

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  accumulatedContent += parsed.content
                  setState((prev) => ({
                    ...prev,
                    content: accumulatedContent,
                  }))
                }
                if (parsed.conversation_id) {
                  finalConversationId = parsed.conversation_id
                  setState((prev) => ({
                    ...prev,
                    conversationId: parsed.conversation_id,
                  }))
                }
                if (parsed.message_id) {
                  finalMessageId = parsed.message_id
                  setState((prev) => ({
                    ...prev,
                    messageId: parsed.message_id,
                  }))
                }
              } catch {
                // Skip non-JSON lines
              }
            }
          }
        }

        setState((prev) => ({ ...prev, isStreaming: false }))

        if (finalConversationId && finalMessageId) {
          options.onComplete?.(accumulatedContent, finalConversationId, finalMessageId)
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          setState((prev) => ({ ...prev, isStreaming: false }))
          return
        }

        const err = error instanceof Error ? error : new Error('Streaming failed')
        setState((prev) => ({
          ...prev,
          isStreaming: false,
          error: err,
        }))
        options.onError?.(err)
      }
    },
    [options]
  )

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setState((prev) => ({ ...prev, isStreaming: false }))
  }, [])

  const reset = useCallback(() => {
    setState({
      content: '',
      isStreaming: false,
      error: null,
      conversationId: null,
      messageId: null,
    })
  }, [])

  return {
    ...state,
    startStreaming,
    stopStreaming,
    reset,
  }
}

export default useStreamingResponse
