import type { LucideIcon } from 'lucide-react';
import type { Shortcut } from '@/lib/settings';

export type NavigationTree = 'public' | 'dashboard';

export type NavigationItemId = string;

export type NavigationItem = {
  id: NavigationItemId;
  name: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  shortcut?: Shortcut;
  devOnly?: boolean;
  external?: boolean;
  trees: NavigationTree[];
};

export type NavigationItemWithIcon = NavigationItem & {
  icon: LucideIcon;
};

export type NavigationGroup = {
  id: string;
  label?: string;
  items: NavigationItemId[];
  trees: NavigationTree[];
};

export type NavigationConfig = {
  items: Record<NavigationItemId, NavigationItem>;
  groups: NavigationGroup[];
};
