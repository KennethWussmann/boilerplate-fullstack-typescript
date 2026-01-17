import { useAtom } from 'jotai/react';
import { Kbd } from '@/components/ui';
import { type Shortcut, settings } from '@/lib';
import { replaceShortcutSymbols } from '@/lib/shortcuts';
import { isTouchDevice } from '@/lib/utils';

type ShortcutKeysProps = {
  shortcut: Shortcut;
} & Partial<Pick<HTMLSpanElement, 'className'>>;

export const ShortcutKeys = ({ shortcut, className }: ShortcutKeysProps) => {
  const [shortcutKeys] = useAtom(settings.shortcuts[shortcut]);

  if (isTouchDevice()) {
    return null;
  }

  const displayText = shortcutKeys
    .split('+')
    .map((key) => replaceShortcutSymbols(key))
    .join(' + ');

  return <Kbd className={className}>{displayText}</Kbd>;
};
