import { useEffect, useState } from 'react';
import { apolloClient, graphql } from '@/lib/graphql';

const HEALTH_SUBSCRIPTION = graphql(`
  subscription OnServerHealthChange {
    health {
      status
      timestamp
    }
  }
`);

export type ServerStatus = 'online' | 'offline';

export const useServerStatus = (): {
  status: 'online' | 'offline';
  isOnline: boolean;
} => {
  const [status, setStatus] = useState<ServerStatus>('offline');

  useEffect(() => {
    if (!apolloClient) {
      setStatus('offline');
      return;
    }
    const observable = apolloClient.subscribe({
      query: HEALTH_SUBSCRIPTION,
    });
    const subscription = observable.subscribe(({ data, error }) => {
      if (error) {
        setStatus('offline');
        return;
      }

      if (data?.health.status === 'ONLINE') {
        setStatus('online');
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isOnline: status === 'online', status };
};
