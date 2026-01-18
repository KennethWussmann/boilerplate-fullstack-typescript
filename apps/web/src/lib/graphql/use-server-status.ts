import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { apolloClient, graphql } from '@/lib/graphql';
import { settings } from '../settings';

const HEALTH_SUBSCRIPTION = graphql(`
  subscription OnServerHealthChange {
    health {
      status
      timestamp
    }
  }
`);

export type ServerStatus = 'online' | 'offline' | 'disabled';

export const useServerStatus = (): {
  status: ServerStatus;
  isOnline: boolean;
} => {
  const [isApiEnabled] = useAtom(settings.backend.enabled);
  const [status, setStatus] = useState<ServerStatus>(!isApiEnabled ? 'disabled' : 'offline');

  useEffect(() => {
    if (!isApiEnabled || !apolloClient) {
      setStatus('disabled');
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
  }, [isApiEnabled]);

  return { isOnline: status === 'online', status };
};
