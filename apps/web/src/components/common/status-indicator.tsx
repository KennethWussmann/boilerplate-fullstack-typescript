import type { ServerStatus } from '@/lib';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: ServerStatus | 'warning' | 'error';
  label?: string;
  showDot?: boolean;
  animate?: boolean;
}

const statusConfig: Record<
  string,
  {
    color: string;
    textColor: string;
    label: string;
    animate?: boolean;
  }
> = {
  online: {
    color: 'bg-green-500',
    textColor: 'text-green-700',
    label: 'Online',
    animate: true,
  },
  offline: {
    color: 'bg-red-500',
    textColor: 'text-red-700',
    label: 'Offline',
    animate: true,
  },
  disabled: {
    color: 'bg-gray-400',
    textColor: 'text-gray-700',
    label: 'Disabled',
  },
  warning: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    label: 'Warning',
    animate: true,
  },
  error: {
    color: 'bg-red-500',
    textColor: 'text-red-700',
    label: 'Error',
    animate: true,
  },
};

export const StatusIndicator = ({
  status,
  label,
  showDot = true,
  animate,
}: StatusIndicatorProps) => {
  const config = statusConfig[status];
  const displayLabel = label || config.label;
  const displayAnimation = animate != null ? animate : config.animate;

  return (
    <div className="flex items-center gap-2">
      {showDot && (
        <span className="relative flex h-3 w-3">
          <span
            className={cn(
              'absolute inline-flex h-full w-full  rounded-full opacity-75',
              config.color,
              {
                'animate-ping': displayAnimation,
              }
            )}
          />
          <span className={cn('relative inline-flex h-3 w-3 rounded-full', config.color)} />
        </span>
      )}
      <span className={cn('text-sm font-medium', config.textColor)}>{displayLabel}</span>
    </div>
  );
};
