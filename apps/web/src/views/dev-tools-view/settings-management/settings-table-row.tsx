import { Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import { stripQuotes } from '@/lib';

type SettingsTableRowProps = {
  storageKey: string;
  value: string;
  onDelete: (key: string) => void;
};

export const SettingsTableRow = ({ storageKey, value, onDelete }: SettingsTableRowProps) => {
  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="flex items-center gap-2 py-2 border-b last:border-b-0">
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <code
          className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[500px]"
          title={storageKey}
        >
          {storageKey}
        </code>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 flex-shrink-0"
          onClick={() => copyToClipboard(storageKey, 'Key')}
        >
          <Copy className="size-4" />
        </Button>
      </div>
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[200px]" title={value}>
          {stripQuotes(value)}
        </code>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 flex-shrink-0"
          onClick={() => copyToClipboard(stripQuotes(value), 'Value')}
        >
          <Copy className="size-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 flex-shrink-0 text-destructive hover:text-destructive"
        onClick={() => onDelete(storageKey)}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
};
