import { useAtom } from 'jotai';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui';
import { settings, ThemeDropdownMenu } from '@/lib';
import { DeveloperOnly } from '../dev-tools';

export const DefaultToolbar = () => {
  const [isApiEnabled] = useAtom(settings.backend.enabled);
  const [httpUrl] = useAtom(settings.backend.httpUrl);

  return (
    <div className="flex gap-2">
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
