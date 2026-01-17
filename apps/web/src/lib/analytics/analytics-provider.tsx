import { useAtomValue } from 'jotai/react';
import { useEffect } from 'react';
import { settings } from '@/lib';
import { initializeAnalytics } from '@/lib/analytics';

export const AnalyticsProvider = () => {
  const isEnabled = useAtomValue(settings.analytics.enabled);

  useEffect(() => {
    if (isEnabled) {
      initializeAnalytics();
    }
  }, [isEnabled]);

  return null;
};
