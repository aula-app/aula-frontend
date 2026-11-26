import { useMemo } from 'react';
import { SIDEBAR_ITEMS, NavItem } from './sidebarItems';

export function useSidebarItems(): NavItem[] {
  return useMemo(() => SIDEBAR_ITEMS.filter((item) => item.permission()), []);
}
