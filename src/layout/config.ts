/**
 * Layout configuration
 */

import { ICON_TYPE } from '@/components/new/Icon/Icon';
import MessageBadge from '@/components/new/UpdateBadges/MessageBadge';
import UpdateBadge from '@/components/new/UpdateBadges/UpdateBadge';
import { checkPermissions } from '@/utils';

/**
 * SideBar configuration
 */

export const SIDEBAR_DESKTOP_ANCHOR = 'right'; // 'left';
export const SIDEBAR_WIDTH = '240px';

type PageLink = {
  icon?: ICON_TYPE; // Icon name to use as <AppIcon icon={icon} />
  component?: React.ComponentType; // Custom component to render instead of link
  path?: string; // URL to navigate to
  title?: string; // Title or primary text to display
  subtitle?: string; // Sub-title or secondary text to display
  restricted?: boolean;
  permission: () => boolean;
};

export const SIDEBAR_ITEMS: Array<PageLink> = [
  {
    title: 'updates',
    path: '/updates',
    icon: 'heart',
    component: UpdateBadge,
    permission: () => true,
  },
  {
    title: 'inbox',
    path: '/messages',
    icon: 'message',
    component: MessageBadge,
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
];
