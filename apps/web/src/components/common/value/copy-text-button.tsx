import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type CopyTextButtonProps = {
  value: string;
  className?: string;
};

export const CopyTextButton = ({ value, className }: CopyTextButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      className={cn(
        'text-muted-foreground hover:text-foreground shrink-0 transition-colors',
        className
      )}
      onClick={handleCopy}
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </button>
  );
};
