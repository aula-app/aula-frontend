/**
 * Layout configuration
 */

import { LinkToPage } from '@/types/PageLinks';
import { checkPermissions } from '@/utils';

/**
 * SideBar configuration
 */

const SIDEBAR_MOBILE_ANCHOR = 'right'; // 'left';
export const SIDEBAR_DESKTOP_ANCHOR = 'right'; // 'left';
export const SIDEBAR_WIDTH = '240px';

export const SIDEBAR_ITEMS: Array<LinkToPage> = [
  {
    title: 'home',
    path: '/',
    icon: 'home',
    permission: () => true,
  },
  {
    title: 'profile',
    path: '/settings/profile',
    icon: 'account',
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
    title: 'messages',
    path: '/settings/messages',
    icon: 'message',
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
    icon: 'info',
    permission: () => true,
  },
];

/**
 * TopBar configuration
 */
export const TOPBAR_MOBILE_HEIGHT = '56px';
export const TOPBAR_DESKTOP_HEIGHT = '64px';

/**
 * BottomBar configuration
 */
const BOTTOMBAR_DESKTOP_VISIBLE = false; // true;
