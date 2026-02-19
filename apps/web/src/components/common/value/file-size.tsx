import { Check, Copy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { cn } from '@/lib/utils';

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;
const K = 1024;

type FileSizeProps = {
  bytes: number | string | null | undefined;
  decimals?: number;
  className?: string;
};

const toNumericBytes = (bytes: number | string | null | undefined): number | null => {
  if (bytes === null || bytes === undefined || bytes === '') return null;
  const num = typeof bytes === 'string' ? Number(bytes) : bytes;
  if (Number.isNaN(num) || !Number.isFinite(num)) return null;
  return num;
};

const getBestUnitIndex = (bytes: number): number => {
  if (bytes === 0) return 0;
  return Math.min(Math.floor(Math.log(Math.abs(bytes)) / Math.log(K)), UNITS.length - 1);
};

const formatAtUnit = (bytes: number, unitIndex: number, decimals: number): string =>
  Number.parseFloat((bytes / K ** unitIndex).toFixed(decimals)).toString();

export const FileSize = ({ bytes, decimals = 2, className }: FileSizeProps) => {
  const numericBytes = useMemo(() => toNumericBytes(bytes), [bytes]);
  const bestUnitIndex = useMemo(
    () => (numericBytes === null ? 0 : getBestUnitIndex(numericBytes)),
    [numericBytes]
  );

  const [stepsDown, setStepsDown] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [copiedUnit, setCopiedUnit] = useState<string | null>(null);

  if (numericBytes === null) {
    return <span className={cn('text-muted-foreground', className)}>-</span>;
  }

  if (numericBytes === 0) {
    return <span className={className}>0 B</span>;
  }

  const totalSteps = bestUnitIndex + 1;
  const currentUnitIndex = bestUnitIndex - (stepsDown % totalSteps);

  const allConversions = UNITS.slice(0, bestUnitIndex + 1)
    .map((unit, i) => ({
      unit,
      value: formatAtUnit(numericBytes, i, decimals),
    }))
    .reverse();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStepsDown((prev) => prev + 1);
  };

  const handleCopy = (value: string, unit: string) => {
    navigator.clipboard.writeText(`${value} ${unit}`);
    setCopiedUnit(unit);
    setTimeout(() => setCopiedUnit(null), 1500);
  };

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'cursor-pointer decoration-dotted underline-offset-4 hover:underline tabular-nums bg-transparent border-none p-0 font-inherit text-inherit text-left',
            className
          )}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={handleClick}
        >
          {formatAtUnit(numericBytes, currentUnitIndex, decimals)} {UNITS[currentUnitIndex]}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-2"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="space-y-0.5">
          {allConversions.map(({ unit, value }) => (
            <div
              key={unit}
              className={cn(
                'flex items-center gap-2 rounded px-2 py-0.5 text-sm tabular-nums',
                unit === UNITS[currentUnitIndex] && 'bg-accent font-medium'
              )}
            >
              <span className="text-muted-foreground w-6">{unit}</span>
              <span className="flex-1 text-right">{value}</span>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(value, unit);
                }}
              >
                {copiedUnit === unit ? <Check className="size-3" /> : <Copy className="size-3" />}
              </button>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
