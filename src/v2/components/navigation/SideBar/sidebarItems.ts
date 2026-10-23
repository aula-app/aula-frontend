import type { ComponentType } from 'react';
import type { ICON_TYPE } from '@/v2/components/ui/Icon';
import { checkPermissions } from '@/utils';
import { MessagesChip, UpdatesChip } from './SidebarChips';

export type NavItem = {
  path: string;
  icon: ICON_TYPE;
  title: string; // i18n key suffix — used as ui.navigation.${title}
  permission: () => boolean;
  chip?: ComponentType; // display-only, no buttons or links; brings its own screen-reader text
};

export const SIDEBAR_ITEMS: NavItem[] = [
  {
    title: 'updates',
    path: '/updates',
    icon: 'bell',
    permission: () => true,
    chip: UpdatesChip,
  },
  {
    title: 'messages',
    path: '/messages',
    icon: 'message',
    permission: () => true,
    chip: MessagesChip,
  },
  {
    title: 'users',
    path: '/settings/users',
    icon: 'group',
    permission: () => checkPermissions('users', 'viewAll'),
  },
  {
    title: 'rooms',
    path: '/settings/rooms',
    icon: 'room',
    permission: () => checkPermissions('rooms', 'viewAll'),
  },
  {
    title: 'boxes',
    path: '/settings/boxes',
    icon: 'box',
    permission: () => checkPermissions('boxes', 'viewAll'),
  },
  {
    title: 'ideas',
    path: '/settings/ideas',
    icon: 'idea',
    permission: () => checkPermissions('ideas', 'viewAll'),
  },
  {
    title: 'schoolMessages',
    path: '/settings/messages',
    icon: 'messages',
    permission: () => checkPermissions('messages', 'viewAll'),
  },
  {
    title: 'announcements',
    path: '/settings/announcements',
    icon: 'announcement',
    permission: () => checkPermissions('announcements', 'viewAll'),
  },
  {
    title: 'configuration',
    path: '/settings/configuration',
    icon: 'settings',
    permission: () => checkPermissions('system', 'edit'),
  },
  {
    title: 'about',
    path: '/about',
    icon: 'about',
    permission: () => true,
  },
];
