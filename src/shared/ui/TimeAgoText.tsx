import { useState, useEffect } from 'react';
import { getRelativeTime } from '@/utils/formatTime';

interface TimeAgoTextProps {
  date: string | Date;
  className?: string;
}

export function TimeAgoText({ date, className = '' }: TimeAgoTextProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    // Initial evaluation
    setTimeAgo(getRelativeTime(date));

    // Setup an interval to auto-update every 30 seconds
    const intervalId = setInterval(() => {
      setTimeAgo(getRelativeTime(date));
    }, 30000);

    return () => clearInterval(intervalId);
  }, [date]);

  return <span className={className}>{timeAgo}</span>;
}
