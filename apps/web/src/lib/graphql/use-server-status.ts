import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { apolloClient, graphql } from '@/lib/graphql';
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

  useEffect(() => {
    if (!isApiEnabled || !apolloClient) {
      setStatus('disabled');
      return;
    }

    let subscription: { unsubscribe: () => void } | undefined;

    const pollStatus = async () => {
      if (!apolloClient) {
        return;
      }
      try {
        const result = await apolloClient.query({
          query: HEALTH_QUERY,
          fetchPolicy: 'network-only',
        });
        setStatus(mapServerStatus(result.data?.health.status));
      } catch {
        setStatus('offline');
      }
    };

    const setupSubscription = () => {
      if (!apolloClient) {
        return;
      }
      const observable = apolloClient.subscribe({
        query: HEALTH_SUBSCRIPTION,
      });

      subscription = observable.subscribe({
        next: ({ data }) => {
          setStatus(mapServerStatus(data?.health.status));
        },
        error: () => {
          setStatus('offline');
        },
      });
    };

    pollStatus();
    setupSubscription();

    const interval = setInterval(pollStatus, 10000);

    return () => {
      subscription?.unsubscribe();
      clearInterval(interval);
    };
  }, [isApiEnabled]);

  return { isOnline: status === 'online', status };
};
