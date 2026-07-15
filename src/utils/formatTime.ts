import { formatDistanceToNow, format, parseISO } from 'date-fns';

/**
 * Ensures a date string from the backend is treated as UTC.
 * .NET returns ISO strings like "2026-07-15T14:20:22" (without Z) or
 * "2026-07-15T14:20:22Z" (with Z). We normalize both to UTC.
 */
function ensureUtc(dateStr: string): string {
  if (!dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.includes('-', 10)) {
    return dateStr + 'Z';
  }
  return dateStr;
}

/**
 * Parses a UTC date string from the backend into a proper Date object.
 * Handles both ISO formats with and without the trailing 'Z'.
 */
export function parseUtcDate(dateInput: string | Date): Date {
  if (dateInput instanceof Date) return dateInput;
  return parseISO(ensureUtc(dateInput));
}

/**
 * Returns a human-readable relative time string.
 * e.g., "Just now", "5 minutes ago", "2 hours ago", "3 days ago"
 * 
 * Best used for: Notification timestamps, activity feeds, comments.
 */
export function getRelativeTime(dateInput: string | Date): string {
  try {
    const date = parseUtcDate(dateInput);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // For very recent times, show "Just now" instead of "less than a minute ago"
    if (diffInSeconds < 60) return 'Just now';

    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Just now';
  }
}

/**
 * Formats a UTC date into the user's local timezone as a readable absolute string.
 * e.g., "15 Jul 2026, 05:20 PM"
 * 
 * Best used for: Order details, pharmacy profiles, complaint timestamps.
 */
export function formatLocalDateTime(dateInput: string | Date): string {
  try {
    const date = parseUtcDate(dateInput);
    return format(date, 'dd MMM yyyy, hh:mm a');
  } catch {
    return 'N/A';
  }
}

/**
 * Formats a UTC date into just the local date portion.
 * e.g., "15 Jul 2026"
 * 
 * Best used for: Table columns, cards, summaries.
 */
export function formatLocalDate(dateInput: string | Date): string {
  try {
    const date = parseUtcDate(dateInput);
    return format(date, 'dd MMM yyyy');
  } catch {
    return 'N/A';
  }
}

/**
 * Formats a UTC date into just the local time portion.
 * e.g., "05:20 PM"
 */
export function formatLocalTime(dateInput: string | Date): string {
  try {
    const date = parseUtcDate(dateInput);
    return format(date, 'hh:mm a');
  } catch {
    return 'N/A';
  }
}
