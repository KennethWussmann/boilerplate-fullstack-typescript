import { useAtom } from 'jotai/react';
import { settings } from '@/lib';

export const useDevMode = () => {
  const [isEnabled] = useAtom(settings.featureToggles.developerTools);
  return isEnabled;
};
