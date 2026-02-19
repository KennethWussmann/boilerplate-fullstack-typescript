import { useQuery, useSubscription } from '@apollo/client/react';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { graphql } from '@/lib/graphql';
import { settings } from '../settings';

const HEALTH_QUERY = graphql(`
  query GetServerHealth {
    health {
      status
      timestamp
    }
  }
`);

const HEALTH_SUBSCRIPTION = graphql(`
  subscription OnServerHealthChange {
    health {
      status
      timestamp
    }
  }
`);

export type ServerStatus = 'online' | 'offline' | 'disabled';

const mapServerStatus = (status: string | undefined): ServerStatus => {
  if (status === 'ONLINE') return 'online';
  return 'offline';
};

export const useServerStatus = (): {
  status: ServerStatus;
  isOnline: boolean;
} => {
  const [isApiEnabled] = useAtom(settings.backend.enabled);
  const [status, setStatus] = useState<ServerStatus>(!isApiEnabled ? 'disabled' : 'online');

  const { data, error } = useQuery(HEALTH_QUERY, {
    skip: !isApiEnabled,
    pollInterval: 30000,
  });

  useSubscription(HEALTH_SUBSCRIPTION, {
    skip: !isApiEnabled,
    onData: ({ data: subData }) => {
      const serverStatus = subData.data?.health?.status;
      if (serverStatus) {
        setStatus(mapServerStatus(serverStatus));
      }
    },
  });

  useEffect(() => {
    if (!isApiEnabled) {
      setStatus('disabled');
    } else if (error) {
      setStatus('offline');
    } else if (data) {
      setStatus(mapServerStatus(data.health.status));
    }
  }, [isApiEnabled, data, error]);

  return { status, isOnline: status === 'online' };
};
