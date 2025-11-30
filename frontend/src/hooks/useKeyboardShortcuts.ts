/**
 * useKeyboardShortcuts Hook
 * Handle keyboard shortcuts for chat interface
 *
 * @module hooks/useKeyboardShortcuts
 */

import { useEffect, useCallback } from 'react'

interface ShortcutHandler {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  handler: () => void
  preventDefault?: boolean
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean
  shortcuts: ShortcutHandler[]
}

export function useKeyboardShortcuts({
  enabled = true,
  shortcuts,
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
        const altMatch = shortcut.alt ? event.altKey : !event.altKey
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault()
          }
          shortcut.handler()
          break
        }
      }
    },
    [enabled, shortcuts]
  )

  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, handleKeyDown])
}

// Preset shortcuts for chat
export const CHAT_SHORTCUTS = {
  SEND: { key: 'Enter', ctrl: true },
  CANCEL: { key: 'Escape' },
  NEW_CHAT: { key: 'n', ctrl: true },
  SEARCH: { key: 'k', ctrl: true },
  EXPORT: { key: 'e', ctrl: true, shift: true },
}

export default useKeyboardShortcuts
