import { BuildInfoCard } from './build-info';
import { LogViewerCard } from './log-viewer';
import { SettingsManagementCard } from './settings-management';

export const DevToolsView = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Developer Tools</h2>
        <p className="text-muted-foreground">Development utilities and debugging tools</p>
      </div>
      <LogViewerCard />
      <SettingsManagementCard />
      <BuildInfoCard />
    </div>
  );
};
