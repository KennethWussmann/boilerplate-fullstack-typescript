import { Pause, Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';

type LogViewerToolbarProps = {
  isPaused: boolean;
  logCount: number;
  onTogglePause: () => void;
  onClear: () => void;
};

export const LogViewerToolbar = ({
  isPaused,
  logCount,
  onTogglePause,
  onClear,
}: LogViewerToolbarProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Server Logs</span>
        <span className="text-xs text-muted-foreground">({logCount} entries)</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePause}
          title={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={onClear}
          title="Clear logs"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};
