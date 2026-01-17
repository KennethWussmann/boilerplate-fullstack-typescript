import { Code, Home, Settings } from 'lucide-react';
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
};

const groups: NavigationGroup[] = [
  {
    id: 'main',
    items: ['dashboard', 'settings'],
    trees: ['dashboard'],
  },
  {
    id: 'developer',
    label: 'Developer',
    items: ['devTools'],
    trees: ['dashboard'],
  },
  {
    id: 'public-main',
    items: ['dashboard'],
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
