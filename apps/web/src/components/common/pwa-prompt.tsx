import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { productName } from '@/lib/constants';

export const PWAPrompt = () => {
  const { updateServiceWorker } = useRegisterSW({
    onRegistered: (r) => {
      console.log('Service worker registered:', r);
      if (r) {
        setInterval(
          () => {
            r.update();
          },
          60 * 60 * 1000
        );
      }
    },
    onRegisterError: (err) => {
      console.error('Failed to register service worker', err);
    },
    onOfflineReady: () => {
      console.log('Offline ready');
      toast.success('Work offline', {
        description: `${productName} is ready to work offline`,
        duration: 5000,
      });
    },
    onNeedRefresh: () => {
      console.log('New update available. Refresh to update.');

      updateServiceWorker(true);

      toast.info('Update available', {
        description: `A new version of ${productName} is available`,
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: (
            <>
              <RefreshCw className="size-4" />
              Refresh
            </>
          ),
          onClick: () => {
            updateServiceWorker(true);
          },
        },
      });
    },
  });

  return null;
};
