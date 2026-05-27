import type { ComponentType } from 'react';
import type { ICON_TYPE } from '@/v2/components/ui/Icon';
import { checkPermissions } from '@/utils';

export type NavItem = {
  path: string;
  icon: ICON_TYPE;
  title: string; // i18n key suffix — used as ui.navigation.${title}
  permission: () => boolean;
  chip?: ComponentType; // reserved for future v2 chip badge components
};

export const SIDEBAR_ITEMS: NavItem[] = [
  {
    title: 'updates',
    path: '/updates',
    icon: 'heart',
    permission: () => true,
  },
  {
    title: 'messages',
    path: '/messages',
    icon: 'message',
    permission: () => true,
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
    title: 'reports',
    path: '/settings/reports',
    icon: 'report',
    permission: () => checkPermissions('reports', 'viewAll'),
  },
  {
    title: 'bugs',
    path: '/settings/bugs',
    icon: 'bug',
    permission: () => checkPermissions('reports', 'viewAll'),
  },
  {
    title: 'requests',
    path: '/settings/requests',
    icon: 'request',
    permission: () => checkPermissions('requests', 'viewAll'),
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
