import { formatDistanceToNow } from 'date-fns';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { InteractiveValue } from './interactive-value';

const RELATIVE_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

type DateTimeProps = {
  date: string | Date | null | undefined;
  mode?: 'auto' | 'relative' | 'absolute';
  display?: 'date-time' | 'date' | 'time';
  className?: string;
};

const toDate = (date: string | Date | null | undefined): Date | null => {
  if (date === null || date === undefined || date === '') return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return null;
  return d;
};

const formatAbsoluteLocal = (date: Date, display: 'date-time' | 'date' | 'time'): string => {
  const options: Intl.DateTimeFormatOptions = {};
  if (display === 'date-time' || display === 'date') options.dateStyle = 'medium';
  if (display === 'date-time' || display === 'time') options.timeStyle = 'medium';
  return new Intl.DateTimeFormat(undefined, options).format(date);
};

const pad = (n: number): string => String(n).padStart(2, '0');

const formatISOUTC = (date: Date, display: 'date-time' | 'date' | 'time'): string => {
  const iso = date.toISOString();
  if (display === 'date') return iso.slice(0, 10);
  if (display === 'time') return iso.slice(11);
  return iso;
};

const formatISOLocal = (date: Date, display: 'date-time' | 'date' | 'time'): string => {
  const y = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const s = pad(date.getSeconds());

  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const oH = pad(Math.floor(Math.abs(offset) / 60));
  const oM = pad(Math.abs(offset) % 60);
  const tz = `${sign}${oH}:${oM}`;

  if (display === 'date') return `${y}-${mo}-${d}`;
  if (display === 'time') return `${h}:${mi}:${s}${tz}`;
  return `${y}-${mo}-${d}T${h}:${mi}:${s}${tz}`;
};

export const DateTime = ({
  date,
  mode = 'auto',
  display = 'date-time',
  className,
}: DateTimeProps) => {
  const dateObj = useMemo(() => toDate(date), [date]);
  const [isOverridden, setIsOverridden] = useState(false);

  if (!dateObj) {
    return <span className={cn('text-muted-foreground', className)}>-</span>;
  }

  const isPastThreshold = Date.now() - dateObj.getTime() > RELATIVE_THRESHOLD_MS;
  const defaultShowsAbsolute = mode === 'absolute' || (mode === 'auto' && isPastThreshold);
  const showAbsolute = isOverridden ? !defaultShowsAbsolute : defaultShowsAbsolute;

  const displayText = showAbsolute
    ? formatAbsoluteLocal(dateObj, display)
    : formatDistanceToNow(dateObj, { addSuffix: true });

  const items = [
    { label: 'Local', value: formatAbsoluteLocal(dateObj, display) },
    { label: 'ISO UTC', value: formatISOUTC(dateObj, display) },
    { label: 'ISO Local', value: formatISOLocal(dateObj, display) },
  ];

  return (
    <InteractiveValue
      displayText={displayText}
      items={items}
      activeLabel={showAbsolute ? 'Local' : undefined}
      onCycle={(e) => {
        e.stopPropagation();
        setIsOverridden((prev) => !prev);
      }}
      className={className}
    />
  );
};
