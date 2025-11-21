import { useQuery, useSubscription } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui';
import { graphql, type ResultOf } from '@/lib';

const ServerHealthQuery = graphql(`
  query ServerHealth {
    health {
      status
    }
  }
`);

const ServerHealthSubscription = graphql(`
  subscription ServerHealth {
    health {
      status
    }
  }
`);

type ServerStatus = ResultOf<typeof ServerHealthQuery>['health']['status'];

const statusMap: Record<ServerStatus, string> = {
  ONLINE: 'Online',
  STARTING: 'Starting',
  STOPPING: 'Stopping',
};

export const ServerHealthBadge = () => {
  const [status, setStatus] = useState<ServerStatus | null>();
  const { data: healthSingle } = useQuery(ServerHealthQuery);
  useSubscription(ServerHealthSubscription, {
    onData: ({ data }) => {
      setStatus(data.data?.health?.status);
    },
    onError: (error) => {
      console.error('Failed to fetch server status', error);
      setStatus(null);
    },
  });

  useEffect(() => {
    setStatus(healthSingle?.health?.status ?? null);
  }, [healthSingle]);
  return (
    <Badge variant={status ? 'default' : 'destructive'}>
      {status ? statusMap[status] : 'Offline'}
    </Badge>
  );
};
