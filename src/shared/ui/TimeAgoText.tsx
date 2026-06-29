import React, { useState, useEffect } from 'react';

interface TimeAgoTextProps {
  date: string | Date;
  className?: string;
}

export function TimeAgoText({ date, className = '' }: TimeAgoTextProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const calculateTimeAgo = () => {
      try {
        const d = new Date(date);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
        
        if (diffSecs < 60) {
          return 'Just now';
        }
        
        const diffMins = Math.floor(diffSecs / 60);
        if (diffMins < 60) {
          return `${diffMins}m ago`;
        }
        
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) {
          return `${diffHrs}h ago`;
        }
        
        const diffDays = Math.floor(diffHrs / 24);
        return `${diffDays}d ago`;
      } catch {
        return 'Just now';
      }
    };

    // Initial evaluation
    setTimeAgo(calculateTimeAgo());

    // Setup an interval to auto-update every 30 seconds
    const intervalId = setInterval(() => {
      setTimeAgo(calculateTimeAgo());
    }, 30000);

    return () => clearInterval(intervalId);
  }, [date]);

  return <span className={className}>{timeAgo}</span>;
}
