import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  initialPageIndex?: number;
  initialPageSize?: number;
}

export function usePagination({
  initialPageIndex = 1,
  initialPageSize = 10,
}: UsePaginationOptions = {}) {
  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const resetPagination = useCallback(() => {
    setPageIndex(initialPageIndex);
    setPageSize(initialPageSize);
  }, [initialPageIndex, initialPageSize]);

  return {
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    resetPagination,
  };
}
