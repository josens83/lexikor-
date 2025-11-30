/**
 * Accessibility Utilities
 * ARIA labels and accessibility helpers for chat components
 *
 * @module utils/accessibility
 */

// ARIA labels for chat components (Korean)
export const ARIA_LABELS = {
  // Chat interface
  chatContainer: '법률 AI 채팅',
  messageList: '대화 메시지 목록',
  messageInput: '메시지 입력',
  sendButton: '메시지 전송',
  newChatButton: '새 대화 시작',

  // Messages
  userMessage: '사용자 메시지',
  assistantMessage: 'AI 어시스턴트 메시지',
  messageTimestamp: '메시지 시간',

  // Feedback
  likeButton: '좋아요',
  dislikeButton: '싫어요',
  copyButton: '복사',

  // Navigation
  scrollToBottom: '맨 아래로 스크롤',
  openSidebar: '사이드바 열기',
  closeSidebar: '사이드바 닫기',

  // Conversation
  conversationList: '대화 목록',
  conversationItem: (title: string) => `대화: ${title}`,
  deleteConversation: '대화 삭제',
  editTitle: '제목 편집',

  // Status
  loading: '로딩 중',
  sending: 'AI가 응답을 생성하고 있습니다',
  error: '오류가 발생했습니다',

  // File attachment
  attachFile: '파일 첨부',
  removeFile: '파일 제거',
  uploadProgress: (percent: number) => `업로드 ${percent}% 완료`,

  // Theme
  toggleTheme: '테마 변경',
  lightMode: '라이트 모드',
  darkMode: '다크 모드',
}

// Keyboard navigation helpers
export const KEYBOARD_HINTS = {
  send: 'Enter로 전송',
  newLine: 'Shift+Enter로 줄바꿈',
  cancel: 'Esc로 취소',
  navigate: '화살표 키로 탐색',
}

// Screen reader announcements
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const el = document.createElement('div')
  el.setAttribute('role', 'status')
  el.setAttribute('aria-live', priority)
  el.setAttribute('aria-atomic', 'true')
  el.className = 'sr-only'
  el.textContent = message

  document.body.appendChild(el)
  setTimeout(() => document.body.removeChild(el), 1000)
}

// Focus management
export function focusElement(selector: string) {
  const el = document.querySelector<HTMLElement>(selector)
  if (el) {
    el.focus()
    return true
  }
  return false
}

// Skip link target
export function createSkipLink(targetId: string, label: string) {
  return {
    href: `#${targetId}`,
    className: 'skip-link',
    children: label,
  }
}
