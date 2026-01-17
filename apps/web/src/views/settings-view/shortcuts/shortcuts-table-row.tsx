import { useAtom } from 'jotai/react';
import { useRecordHotkeys } from 'react-hotkeys-hook';
import { Badge, Button } from '@/components/ui';
import { type Shortcut, settings } from '@/lib/settings';
import { getShortcutMetadata, replaceShortcutSymbols } from '@/lib/shortcuts';
import { cn } from '@/lib/utils';

type ShortcutsTableRowProps = {
  shortcut: Shortcut;
};

export const ShortcutsTableRow = ({ shortcut }: ShortcutsTableRowProps) => {
  const [keys, setKeys] = useAtom(settings.shortcuts[shortcut]);
  const metadata = getShortcutMetadata(shortcut);
  const Icon = metadata.icon;

  const [recordedKeys, { start, stop, resetKeys, isRecording }] = useRecordHotkeys();

  const handleStartRecording = () => {
    resetKeys();
    start();
  };

  const handleStopRecording = () => {
    stop();
    if (recordedKeys.size > 0) {
      const newKeys = Array.from(recordedKeys).join('+').toLowerCase();
      setKeys(newKeys);
    }
    resetKeys();
  };

  const handleCancelRecording = () => {
    stop();
    resetKeys();
  };

  const displayKeys = keys
    .split('+')
    .map((key) => replaceShortcutSymbols(key))
    .join(' + ');

  const recordingDisplay = Array.from(recordedKeys)
    .map((key) => replaceShortcutSymbols(key))
    .join(' + ');

  return (
    <div className="flex items-center gap-4 py-3 border-b last:border-b-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0 text-muted-foreground">
          <Icon className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm truncate">{metadata.name}</div>
          <div className="text-xs text-muted-foreground truncate">{metadata.description}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isRecording ? (
          <>
            <Badge
              variant={'secondary'}
              className={cn('text-md justify-center', recordedKeys.size === 0 && 'opacity-50')}
            >
              {recordedKeys.size > 0 ? recordingDisplay : 'Press keys...'}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleStopRecording}>
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancelRecording}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Badge variant={'secondary'} className="text-md justify-center">
              {displayKeys}
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleStartRecording}>
              Edit
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
