import type { ReactNode } from 'react';
import { useDevMode } from './use-dev-mode';

export const DeveloperOnly = ({ children }: { children: ReactNode }) => {
  const isDev = useDevMode();

  if (!isDev) {
    return null;
  }
  return children;
};
