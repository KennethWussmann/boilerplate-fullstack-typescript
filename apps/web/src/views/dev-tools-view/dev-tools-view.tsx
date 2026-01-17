import * as React from 'react';
import { ErrorBoundary } from '@/components';
import { Button } from '@/components/ui/button';
import { productVersion } from '@/lib';
import { SettingsManagementCard } from './settings-management';

const ErrorThrower = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error thrown from DevToolsView');
  }
  return null;
};

export const DevToolsView = () => {
  const [shouldThrow, setShouldThrow] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Developer Tools</h2>
        <p className="text-muted-foreground">Development utilities and debugging tools</p>
        <div>{productVersion}</div>
      </div>
      <div className="space-y-2">
        <ErrorBoundary>
          <ErrorThrower shouldThrow={shouldThrow} />
        </ErrorBoundary>
        <Button variant="destructive" onClick={() => setShouldThrow(true)}>
          Throw Error
        </Button>
      </div>
      <SettingsManagementCard />
    </div>
  );
};
