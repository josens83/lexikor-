/**
 * useModal Hook
 * Manage modal visibility and selected item state
 */

import { useState, useCallback } from 'react'

interface UseModalReturn<T = any> {
  isVisible: boolean
  selectedItem: T | null
  open: (item?: T) => void
  close: () => void
  toggle: () => void
}

/**
 * Hook for managing modal state
 *
 * @example
 * const { isVisible, selectedItem, open, close } = useModal<Document>()
 *
 * // Open modal with selected item
 * <Button onClick={() => open(document)}>Edit</Button>
 *
 * // Render modal
 * <Modal
 *   open={isVisible}
 *   onCancel={close}
 * >
 *   {selectedItem && <div>{selectedItem.title}</div>}
 * </Modal>
 */
export function useModal<T = any>(): UseModalReturn<T> {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<T | null>(null)

  const open = useCallback((item?: T) => {
    setIsVisible(true)
    if (item !== undefined) {
      setSelectedItem(item)
    }
  }, [])

  const close = useCallback(() => {
    setIsVisible(false)
    setSelectedItem(null)
  }, [])

  const toggle = useCallback(() => {
    setIsVisible((prev) => !prev)
    if (isVisible) {
      setSelectedItem(null)
    }
  }, [isVisible])

  return {
    isVisible,
    selectedItem,
    open,
    close,
    toggle,
  }
}

/**
 * Hook for managing multiple modals
 *
 * @example
 * const modals = useModals(['create', 'edit', 'delete'])
 *
 * // Open specific modal
 * modals.create.open()
 *
 * // Check visibility
 * <Modal open={modals.create.isVisible} onCancel={modals.create.close} />
 */
export function useModals<K extends string>(
  keys: K[]
): Record<K, UseModalReturn> {
  const modals = {} as Record<K, UseModalReturn>

  keys.forEach((key) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    modals[key] = useModal()
  })

  return modals
}
