import { useNavigate } from 'react-router';
import { isDev } from '../constants';
import { useShortcut } from './use-shortcut';

export const useGlobalShortcuts = () => {
  const navigate = useNavigate();

  useShortcut('openDevTools', () => isDev && navigate('/dev-tools'));
  useShortcut('openSettings', () => navigate('/settings'));
};
