import { ThemeDropdownMenu, useServerStatus } from '@/lib';
import { StatusIndicator } from '../status-indicator';

export const DefaultToolbar = () => {
  const { status } = useServerStatus();

  return (
    <div className="flex gap-2">
      {status === 'offline' && <StatusIndicator status={status} />}
      <ThemeDropdownMenu />
    </div>
  );
};
