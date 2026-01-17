import { StatusIndicator } from '@/components';
import { useServerStatus } from '@/lib';

export const DashboardView = () => {
  const { status } = useServerStatus();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome</h2>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Server Status</h3>

          <StatusIndicator status={status} />
        </div>
      </div>
    </div>
  );
};
