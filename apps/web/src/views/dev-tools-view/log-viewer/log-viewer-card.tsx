import { Card, CardContent, ScrollArea } from '@/components/ui';
import { LogEntry } from './log-entry';
import { LogViewerToolbar } from './log-viewer-toolbar';
import { useLogStream } from './use-log-stream';

export const LogViewerCard = () => {
  const { logs, isPaused, clear, togglePause } = useLogStream();

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <LogViewerToolbar
          isPaused={isPaused}
          logCount={logs.length}
          onTogglePause={togglePause}
          onClear={clear}
        />
        <ScrollArea className="h-96">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm py-8">
              {isPaused ? 'Log streaming paused' : 'Waiting for logs...'}
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {logs.map((entry, index) => (
                <LogEntry key={`${entry.timestamp}-${index}`} entry={entry} />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
