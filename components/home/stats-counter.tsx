'use client';

import { useEffect, useState, useRef } from 'react';

interface StatsCounterProps {
  value: string;
  duration?: number; // in milliseconds
}

export function StatsCounter({ value, duration = 5000 }: StatsCounterProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const countRef = useRef<number>(0);

  // Parse the number and symbols (e.g., "14+" -> number: 14, suffix: "+")
  // Handle commas like "2,500+"
  const numericPart = value.replace(/,/g, '').match(/\d+/);
  const targetNumber = numericPart ? parseInt(numericPart[0], 10) : 0;
  const prefix = value.match(/^[^\d]+/)?.[0] || '';
  const suffix = value.match(/[^\d,]+$/)?.[0] || '';
  const hasCommas = value.includes(',');

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Easing function: easeOutExpo (starts fast, slows down at the end)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const currentCount = Math.floor(easeProgress * targetNumber);

      if (currentCount !== countRef.current) {
        countRef.current = currentCount;

        let formattedNumber = currentCount.toString();
        if (hasCommas) {
          formattedNumber = currentCount.toLocaleString('en-IN');
        }

        setDisplayValue(`${prefix}${formattedNumber}${suffix}`);
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [targetNumber, duration, prefix, suffix, hasCommas]);

  return <span>{displayValue}</span>;
}
