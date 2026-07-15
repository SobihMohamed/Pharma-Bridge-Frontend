import { parseUtcDate, formatLocalDate } from './formatTime';

/**
 * @deprecated Use `formatLocalDate` or `formatLocalDateTime` from `@/utils/formatTime` instead.
 * This wrapper exists for backward compatibility.
 */
export const formatDate = (date: string | Date): string => {
  return formatLocalDate(date);
};
