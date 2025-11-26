/**
 * Chat Module Type Definitions
 * Extended types for the refactored chat system
 */

import type { Message, Conversation, MessageRole } from './models'

// ============================================================================
// Legal Areas
// ============================================================================

export const LEGAL_AREAS = [
  'civil',      // 민사
  'criminal',   // 형사
  'commercial', // 상사
  'administrative', // 행정
  'labor',      // 노동
  'family',     // 가족
  'realestate', // 부동산
] as const

export type LegalArea = typeof LEGAL_AREAS[number]

export const LEGAL_AREA_LABELS: Record<LegalArea, string> = {
  civil: '민사',
  criminal: '형사',
  commercial: '상사',
  administrative: '행정',
  labor: '노동',
  family: '가족',
  realestate: '부동산',
}

// ============================================================================
// Chat State
// ============================================================================

export interface ChatState {
  currentConversationId: number | null
  inputMessage: string
  legalArea: LegalArea | null
  isSending: boolean
}

export interface ChatActions {
  setCurrentConversation: (id: number | null) => void
  setInputMessage: (message: string) => void
  setLegalArea: (area: LegalArea | null) => void
  setSending: (sending: boolean) => void
  resetChat: () => void
}

// ============================================================================
// Component Props
// ============================================================================

export interface ChatSidebarProps {
  conversations: Conversation[]
  currentConversationId: number | null
  legalArea: LegalArea | null
  isLoading: boolean
  onSelectConversation: (id: number) => void
  onNewChat: () => void
  onDeleteConversation: (id: number) => void
  onLegalAreaChange: (area: LegalArea | null) => void
}

export interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  isSending: boolean
}

export interface ChatInputProps {
  value: string
  isSending: boolean
  disabled: boolean
  onChange: (value: string) => void
  onSend: () => void
}

export interface ChatHeaderProps {
  title: string
  legalArea: LegalArea | null
  onBack?: () => void
}

export interface MessageBubbleProps {
  message: Message
  isLast?: boolean
}

export interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
  onDelete: () => void
}

export interface LegalAreaSelectorProps {
  value: LegalArea | null
  onChange: (area: LegalArea | null) => void
  size?: 'small' | 'middle' | 'large'
}

// ============================================================================
// API Request/Response (Extended)
// ============================================================================

export interface SendMessageRequest {
  message: string
  conversation_id?: number | null
  legal_area?: string | null
  stream?: boolean
}

export interface SendMessageResponse {
  conversation_id: number
  message_id: number
  role: MessageRole
  content: string
  citations?: Citation[]
  created_at: string
}

export interface Citation {
  type: 'statute' | 'case'
  title: string
  reference: string
  content?: string
}

// ============================================================================
// UI Helpers
// ============================================================================

export interface EmptyStateProps {
  onStartChat?: () => void
}

export interface LoadingStateProps {
  message?: string
}

// ============================================================================
// Event Handlers
// ============================================================================

export type ChatEventHandler = {
  onSendMessage: (message: string) => Promise<void>
  onNewConversation: () => void
  onSelectConversation: (id: number) => void
  onDeleteConversation: (id: number) => Promise<void>
}
