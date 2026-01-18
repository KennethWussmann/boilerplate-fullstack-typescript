import { useAtom } from 'jotai';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui';
import { settings, ThemeDropdownMenu, useServerStatus } from '@/lib';
import { DeveloperOnly } from '../dev-tools';
import { StatusIndicator } from '../status-indicator';

export const DefaultToolbar = () => {
  const [isApiEnabled] = useAtom(settings.backend.enabled);
  const [httpUrl] = useAtom(settings.backend.httpUrl);
  const { status } = useServerStatus();

  return (
    <div className="flex gap-2">
      {status === 'offline' && <StatusIndicator status={status} />}
      <DeveloperOnly>
        {isApiEnabled && (
          <Button variant={'outline'} asChild>
            <Link to={httpUrl} target={'_blank'}>
              <ExternalLink />
              GraphiQL
            </Link>
          </Button>
        )}
      </DeveloperOnly>
      <ThemeDropdownMenu />
    </div>
  );
};
