import React from 'react';
import { IconBaseProps } from 'react-icons';
import {
  HiOutlineAcademicCap,
  HiOutlineArchiveBox,
  HiOutlineArrowRightEndOnRectangle,
  HiOutlineBars3,
  HiOutlineBugAnt,
  HiOutlineChevronLeft,
  HiOutlineCog6Tooth,
  HiOutlineEnvelope,
  HiOutlineExclamationTriangle,
  HiOutlineFlag,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineLightBulb,
  HiOutlineMegaphone,
  HiOutlineMoon,
  HiOutlinePrinter,
  HiOutlineSun,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { LuMails } from 'react-icons/lu';

/**
 * Icon component for the application
 * Only includes icons that are currently in use
 */
export const ICONS = {
  announcement: HiOutlineMegaphone,
  announcements: HiOutlineMegaphone,
  back: HiOutlineChevronLeft,
  box: HiOutlineArchiveBox,
  boxes: HiOutlineArchiveBox,
  bug: HiOutlineBugAnt,
  close: HiOutlineXMark,
  day: HiOutlineSun,
  group: HiOutlineUsers,
  heart: HiOutlineHeart,
  home: HiOutlineHome,
  idea: HiOutlineLightBulb,
  ideas: HiOutlineLightBulb,
  logout: HiOutlineArrowRightEndOnRectangle,
  menu: HiOutlineBars3,
  message: HiOutlineEnvelope,
  messages: LuMails,
  night: HiOutlineMoon,
  print: HiOutlinePrinter,
  report: HiOutlineFlag,
  reports: HiOutlineFlag,
  request: HiOutlineExclamationTriangle,
  requests: HiOutlineExclamationTriangle,
  room: HiOutlineAcademicCap,
  rooms: HiOutlineAcademicCap,
  settings: HiOutlineCog6Tooth,
  users: HiOutlineUserGroup,
};

const ALL_ICONS: Record<string, React.ComponentType<IconBaseProps>> = { ...ICONS };

export type ICON_TYPE = keyof typeof ICONS;

interface Props extends React.SVGAttributes<SVGElement> {
  type: ICON_TYPE;
  size?: string | number;
}

/**
 * Renders SVG icon by given icon name
 * @component Icon
 */
const Icon: React.FC<Props> = ({ type, size = '100%', className, ...restOfProps }) => {
  if (!(type in ALL_ICONS)) return null;

  return React.createElement(ALL_ICONS[type], {
    size,
    className: `app-icon ${className ?? ''}`,
    role: 'img',
    'aria-label': `${type} icon`,
    ...restOfProps,
  });
};

export default Icon;
