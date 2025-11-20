/**
 * useModal Hook - Custom hook for managing modal state
 */

import { useState, useCallback } from 'react'

export interface UseModalReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useModal = (defaultOpen: boolean = false): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}

export default useModal

