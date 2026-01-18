import { RefreshCw } from 'lucide-react';
import { Button, SlotContent } from '@/components';
import { DeveloperOnly } from '@/components/common/dev-tools';
import { DevToolsView } from '@/views/dev-tools-view';

export const DevToolsPage = () => {
  return (
    <DeveloperOnly redirect>
      <SlotContent name="toolbar">
        <Button
          variant="secondary"
          onClick={() => {
            window.location.reload();
          }}
        >
          <RefreshCw /> Reload
        </Button>
      </SlotContent>
      <DevToolsView />
    </DeveloperOnly>
  );
};
