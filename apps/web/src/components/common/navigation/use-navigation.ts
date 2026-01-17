import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { useDevMode } from '@/components/common/dev-tools';
import { getNavigationItem, navigationConfig } from './navigation-registry';
import type { NavigationItem, NavigationTree } from './types';

export type ResolvedNavigationGroup = {
  id: string;
  label?: string;
  items: NavigationItem[];
};

export type UseNavigationResult = {
  groups: ResolvedNavigationGroup[];
  items: NavigationItem[];
  active: NavigationItem | undefined;
};

export const useNavigation = (tree: NavigationTree): UseNavigationResult => {
  const isDevMode = useDevMode();
  const location = useLocation();

  return useMemo(() => {
    const treeGroups = navigationConfig.groups.filter((group) => group.trees.includes(tree));

    const groups = treeGroups
      .map((group): ResolvedNavigationGroup | null => {
        const resolvedItems = group.items
          .map((itemId) => getNavigationItem(itemId))
          .filter((item): item is NavigationItem => {
            if (!item) return false;
            if (!item.trees.includes(tree)) return false;
            if (item.devOnly && !isDevMode) return false;
            return true;
          });

        if (resolvedItems.length === 0) return null;

        return {
          id: group.id,
          label: group.label,
          items: resolvedItems,
        };
      })
      .filter((group): group is ResolvedNavigationGroup => group !== null);

    const items = groups.flatMap((group) => group.items);
    const active = items.find((item) => location.pathname === item.href);

    return { groups, items, active };
  }, [tree, isDevMode, location.pathname]);
};
