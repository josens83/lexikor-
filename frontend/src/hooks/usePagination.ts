/**
 * usePagination Hook
 * Manage pagination state for tables and lists
 */

import { useState, useCallback } from 'react'
import { PAGINATION } from '@/constants'

interface UsePaginationOptions {
  initialPage?: number
  initialPageSize?: number
  totalItems?: number
}

interface UsePaginationReturn {
  currentPage: number
  pageSize: number
  totalPages: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  nextPage: () => void
  prevPage: () => void
  reset: () => void
  setTotal: (total: number) => void
}

/**
 * Hook for managing pagination state
 *
 * @example
 * const pagination = usePagination({ initialPageSize: 20 })
 *
 * // Use in Table
 * <Table
 *   pagination={{
 *     current: pagination.currentPage,
 *     pageSize: pagination.pageSize,
 *     total: totalItems,
 *     onChange: pagination.setPage,
 *     onShowSizeChange: (_, size) => pagination.setPageSize(size),
 *   }}
 * />
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const {
    initialPage = PAGINATION.DEFAULT_PAGE,
    initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE,
    totalItems = 0,
  } = options

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSizeState] = useState(initialPageSize)
  const [total, setTotal] = useState(totalItems)

  const totalPages = Math.ceil(total / pageSize)

  const setPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page)
      }
    },
    [totalPages]
  )

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size)
    setCurrentPage(1) // Reset to first page when changing page size
  }, [])

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [currentPage, totalPages])

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }, [currentPage])

  const reset = useCallback(() => {
    setCurrentPage(initialPage)
    setPageSizeState(initialPageSize)
  }, [initialPage, initialPageSize])

  return {
    currentPage,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    reset,
    setTotal,
  }
}
