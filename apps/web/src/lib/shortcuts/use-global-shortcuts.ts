import { useNavigate } from 'react-router';
import { useDevMode } from '@/components/common/dev-tools';
import { useShortcut } from './use-shortcut';

export const useGlobalShortcuts = () => {
  const { isDev } = useDevMode();
  const navigate = useNavigate();

  useShortcut('openDevTools', () => isDev && navigate('/dev-tools'));
  useShortcut('openSettings', () => navigate('/settings'));
};
