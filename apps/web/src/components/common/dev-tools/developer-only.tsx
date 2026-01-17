import { type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDevMode } from './use-dev-mode';

export const DeveloperOnly = ({
  children,
  redirect,
}: {
  children: ReactNode;
  redirect?: boolean;
}) => {
  const isDev = useDevMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDev || !redirect) {
      return;
    }
    navigate('/');
  }, [isDev, redirect, navigate]);

  if (!isDev) {
    return null;
  }
  return children;
};
