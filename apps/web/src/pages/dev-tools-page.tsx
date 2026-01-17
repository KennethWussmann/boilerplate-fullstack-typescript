import { DeveloperOnly } from '@/components/common/dev-tools';
import { DevToolsView } from '@/views/dev-tools-view';

export const DevToolsPage = () => {
  return (
    <DeveloperOnly redirect>
      <DevToolsView />
    </DeveloperOnly>
  );
};
