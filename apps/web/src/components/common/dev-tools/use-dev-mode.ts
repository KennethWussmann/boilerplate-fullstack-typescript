import { useAtom } from 'jotai/react';
import { settings } from '@/lib';

export const useDevMode = () => {
  const [isEnabled, setEnabled] = useAtom(settings.featureToggles.developerTools);
  return {
    isDev: isEnabled,
    setDev: setEnabled,
  };
};
