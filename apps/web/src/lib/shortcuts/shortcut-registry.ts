import { Book, Code, type LucideIcon, Settings } from 'lucide-react';
import type { Shortcut } from '@/lib/settings';

type ShortcutMetadata = {
  name: string;
  description: string;
  icon: LucideIcon;
  devOnly?: boolean;
};

export const shortcutRegistry: Record<Shortcut, ShortcutMetadata> = {
  openDevTools: {
    name: 'Open Developer Tools',
    description: 'Opens the developer tools',
    icon: Code,
    devOnly: true,
  },
  openSettings: {
    name: 'Open Settings',
    description: 'Opens the settings page',
    icon: Settings,
  },
  openDocs: {
    name: 'Open Documentation',
    description: 'Opens the applications documenation',
    icon: Book,
  },
};

export const getShortcutMetadata = (shortcut: Shortcut): ShortcutMetadata =>
  shortcutRegistry[shortcut];

export const getAllShortcuts = (): Shortcut[] => Object.keys(shortcutRegistry) as Shortcut[];
