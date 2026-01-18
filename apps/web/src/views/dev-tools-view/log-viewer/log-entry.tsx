import { Badge } from '@/components/ui';
import { cn, formatDateTimeLong } from '@/lib';
import type { LogEntry as LogEntryType, LogLevel } from './use-log-stream';

type LogLevelConfig = {
  label: string;
  className: string;
  textClassName: string;
};

const levelConfig: Record<LogLevel, LogLevelConfig> = {
  FATAL: {
    label: 'FATAL',
    className: 'bg-red-900 text-white border-red-700',
    textClassName: 'text-red-400',
  },
  ERROR: {
    label: 'ERROR',
    className: 'bg-red-600 text-white border-red-500',
    textClassName: 'text-red-400',
  },
  WARN: {
    label: 'WARN',
    className: 'bg-yellow-600 text-white border-yellow-500',
    textClassName: 'text-yellow-400',
  },
  NOTICE: {
    label: 'NOTICE',
    className: 'bg-blue-600 text-white border-blue-500',
    textClassName: 'text-blue-400',
  },
  INFO: {
    label: 'INFO',
    className: 'bg-emerald-600 text-white border-emerald-500',
    textClassName: 'text-emerald-400',
  },
  DEBUG: {
    label: 'DEBUG',
    className: 'bg-gray-600 text-white border-gray-500',
    textClassName: 'text-gray-400',
  },
};

type LogEntryProps = {
  entry: LogEntryType;
};

export const LogEntry = ({ entry }: LogEntryProps) => {
  const config = levelConfig[entry.level];
  const formattedTime = formatDateTimeLong(entry.timestamp);

  return (
    <div className="flex items-center gap-4 px-3 py-1.5 font-mono text-xs hover:bg-accent/50 border-b border-border/30">
      <span className="text-muted-foreground shrink-0">{formattedTime}</span>
      <Badge className={cn('text-[10px]', config.className)}>{config.label}</Badge>
      {entry.name && (
        <span className="text-muted-foreground shrink-0 truncate" title={entry.name}>
          {entry.name}
        </span>
      )}
      <span className={cn('flex-1 break-all', config.textClassName)}>{entry.message}</span>
      {entry.metadata && (
        <span
          className="text-muted-foreground/70 shrink-0 max-w-48 truncate"
          title={entry.metadata}
        >
          {entry.metadata}
        </span>
      )}
    </div>
  );
};
