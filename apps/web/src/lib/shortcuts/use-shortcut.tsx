import { useAtom } from 'jotai/react';
import { useHotkeys } from 'react-hotkeys-hook';
import { type Shortcut, settings } from '@/lib/settings';

export const useShortcut = (settingsKey: Shortcut, callback: () => void) => {
  const [shortcut] = useAtom(settings.shortcuts[settingsKey]);

  useHotkeys(shortcut, callback, {
    enableOnFormTags: ['INPUT', 'TEXTAREA'],
    preventDefault: true,
  });
};
