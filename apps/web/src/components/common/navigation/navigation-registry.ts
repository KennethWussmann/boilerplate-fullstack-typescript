import { Code, Home, Settings, Telescope } from 'lucide-react';
import { getHttpApiUrl, shortcutRegistry } from '@/lib';
import type { NavigationConfig, NavigationGroup, NavigationItem } from './types';

const items: Record<string, NavigationItem> = {
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'View your dashboard',
    trees: ['public', 'dashboard'],
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Manage your settings',
    shortcut: 'openSettings',
    trees: ['dashboard'],
  },
  docs: {
    id: 'docs',
    name: 'Documentation',
    href: '/docs',
    icon: shortcutRegistry.openDocs.icon,
    description: 'Read the application documentation',
    shortcut: 'openDocs',
    devOnly: true,
    trees: ['public', 'dashboard'],
  },
  devTools: {
    id: 'devTools',
    name: 'Developer Tools',
    href: '/dev-tools',
    icon: Code,
    description: 'Access developer tools and diagnostics',
    shortcut: 'openDevTools',
    devOnly: true,
    trees: ['dashboard'],
  },
  graphiQL: {
    id: 'graphiQL',
    name: 'GraphiQL',
    href: getHttpApiUrl(),
    icon: Telescope,
    description: 'Open then GraphiQL Playground',
    devOnly: true,
    trees: ['dashboard'],
    external: true,
  },
};

const groups: NavigationGroup[] = [
  {
    id: 'main',
    items: ['dashboard', 'docs', 'settings'],
    trees: ['dashboard'],
  },
  {
    id: 'developer',
    label: 'Developer',
    items: ['devTools', 'graphiQL'],
    trees: ['dashboard'],
  },
  {
    id: 'public-main',
    items: ['docs', 'dashboard'],
    trees: ['public'],
  },
];

export const navigationConfig: NavigationConfig = {
  items,
  groups,
};

export const getNavigationItem = (id: string): NavigationItem | undefined =>
  navigationConfig.items[id];

export const getAllNavigationItems = (): NavigationItem[] => Object.values(navigationConfig.items);

export const getNavigationGroups = (): NavigationGroup[] => navigationConfig.groups;
