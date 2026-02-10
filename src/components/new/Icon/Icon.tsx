import React, { memo } from 'react';
import { IconBaseProps } from 'react-icons';
import {
  HiOutlineAcademicCap,
  HiOutlineArchiveBox,
  HiOutlineArrowRightEndOnRectangle,
  HiOutlineBars3,
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
import { IoBugOutline } from 'react-icons/io5';
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
  bug: IoBugOutline,
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

export type ICON_TYPE = keyof typeof ICONS;

interface Props extends React.SVGAttributes<SVGElement> {
  type: ICON_TYPE;
  size?: string | number;
  isDecorative?: boolean;
  'aria-label'?: string;
}

/**
 * Renders SVG icon by given icon name
 * Optimized for SVG rendering with proper accessibility support
 * @component Icon
 */
const Icon: React.FC<Props> = React.forwardRef<SVGSVGElement, Props>(
  ({ type, size = '1em', className, isDecorative = true, 'aria-label': ariaLabel, ...restOfProps }, ref) => {
    if (!(type in ICONS)) return null;

    const isAccessibleIcon = !isDecorative && !restOfProps['aria-hidden'];

    return React.createElement(ICONS[type], {
      ref,
      size,
      className: `app-icon ${className ?? ''}`,
      role: isAccessibleIcon ? 'img' : undefined,
      'aria-hidden': isDecorative ? 'true' : undefined,
      'aria-label': isAccessibleIcon ? (ariaLabel ?? `${type} icon`) : undefined,
      ...restOfProps,
    } as IconBaseProps);
  }
);

Icon.displayName = 'Icon';

export default memo(Icon);
