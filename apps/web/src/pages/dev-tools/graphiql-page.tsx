import { useAtom } from 'jotai';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import { Button, SlotContent } from '@/components';
import { DeveloperOnly } from '@/components/common/dev-tools';
import { settings } from '@/lib';

export const GraphiQLPage = () => {
  const [httpApiUrl] = useAtom(settings.backend.httpUrl);
  return (
    <DeveloperOnly redirect>
      <SlotContent name="toolbar">
        <Button variant="secondary" asChild>
          <Link to={httpApiUrl} target="_blank">
            <ExternalLink /> GraphiQL
          </Link>
        </Button>
      </SlotContent>
      <iframe src={httpApiUrl} className="h-full w-full" title="GraphiQL Playground"></iframe>
    </DeveloperOnly>
  );
};
