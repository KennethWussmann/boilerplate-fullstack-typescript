import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { cn } from '@/lib/utils';
import { CopyTextButton } from './copy-text-button';

type InteractiveValueItem = {
  label: string;
  value: string;
};

type InteractiveValueProps = {
  displayText: string;
  items: InteractiveValueItem[];
  activeLabel?: string;
  onCycle: (e: React.MouseEvent) => void;
  className?: string;
};

export const InteractiveValue = ({
  displayText,
  items,
  activeLabel,
  onCycle,
  className,
}: InteractiveValueProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'cursor-pointer decoration-dotted underline-offset-4 hover:underline bg-transparent border-none p-0 font-inherit text-inherit text-left',
            className
          )}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={onCycle}
        >
          {displayText}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-2"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="space-y-0.5">
          {items.map(({ label, value }) => (
            <div
              key={label}
              className={cn(
                'flex items-center gap-2 rounded px-2 py-0.5 text-sm',
                label === activeLabel && 'bg-accent font-medium'
              )}
            >
              <span className="text-muted-foreground shrink-0">{label}</span>
              <span className="flex-1 text-right tabular-nums">{value}</span>
              <CopyTextButton value={value} />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
