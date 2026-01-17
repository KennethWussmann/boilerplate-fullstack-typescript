import { isMacOS } from '../utils';
import { replaceAll } from '../utils/string';

export const replaceShortcutSymbols = (shortcut: string | string[] | Set<string>): string => {
  if (shortcut instanceof Set) {
    shortcut = Array.from(shortcut).join('');
  }
  if (Array.isArray(shortcut)) {
    shortcut = shortcut.join('');
  }

  shortcut = shortcut.toUpperCase();

  if (isMacOS()) {
    shortcut = shortcut.replace('META', '⌘').replace('MOD', '⌘');
  } else {
    shortcut = shortcut.replace('MOD', 'Ctrl');
  }

  shortcut = replaceAll(shortcut, '+', '');
  shortcut = shortcut.replace('SHIFT', '⇧');
  shortcut = shortcut.replace('ALT', '⌥');
  shortcut = shortcut.replace('CTRL', '⌃');
  shortcut = shortcut.replace('ENTER', '⏎');
  shortcut = shortcut.replace('BACKSPACE', '⌫');
  shortcut = shortcut.replace('SPACE', '␣');
  shortcut = shortcut.replace('DELETE', '⌦');
  shortcut = shortcut.replace('ESCAPE', '⎋');
  shortcut = shortcut.replace('TAB', '⇥');
  shortcut = shortcut.replace('PAGEUP', 'PgUp');
  shortcut = shortcut.replace('PAGEDOWN', 'PgDn');
  shortcut = shortcut.replace('UP', '↑');
  shortcut = shortcut.replace('DOWN', '↓');
  shortcut = shortcut.replace('LEFT', '←');
  shortcut = shortcut.replace('RIGHT', '→');
  shortcut = shortcut.replace('COMMA', ',');
  return shortcut;
};
