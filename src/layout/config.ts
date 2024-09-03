/**
 * Layout configuration
 */

import { LinkToPage } from '@/types/PageLinks';

/**
 * SideBar configuration
 */
export const SIDEBAR_MOBILE_ANCHOR = 'right'; // 'left';
export const SIDEBAR_DESKTOP_ANCHOR = 'right'; // 'left';
export const SIDEBAR_WIDTH = '240px';

export const SIDEBAR_ITEMS: Array<LinkToPage> = [
  {
    title: 'home',
    path: '/',
    icon: 'home',
    role: 10,
  },
  {
    title: 'profile',
    path: '/settings/profile',
    icon: 'account',
    role: 20,
  },
  {
    title: 'users',
    path: '/settings/users',
    icon: 'group',
    role: 50,
  },
  {
    title: 'rooms',
    path: '/settings/rooms',
    icon: 'room',
    role: 50,
  },
  {
    title: 'boxes',
    path: '/settings/boxes',
    icon: 'box',
    role: 30,
  },
  {
    title: 'ideas',
    path: '/settings/ideas',
    icon: 'idea',
    role: 30,
  },
  {
    title: 'messages',
    path: '/settings/messages',
    icon: 'message',
    role: 50,
  },
  {
    title: 'reports',
    path: '/settings/reports',
    icon: 'report',
    role: 50,
  },
  {
    title: 'configuration',
    path: '/settings/configuration',
    icon: 'settings',
    role: 50,
  },
  {
    title: 'about',
    path: '/about',
    icon: 'info',
    role: 10,
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
export const BOTTOMBAR_DESKTOP_VISIBLE = false; // true;
