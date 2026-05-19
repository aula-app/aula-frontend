import React, { memo } from 'react';
import { IconBaseProps } from 'react-icons';
import {
  HiOutlineAcademicCap,
  HiOutlineArchiveBox,
  HiOutlineArrowRightEndOnRectangle,
  HiOutlineBars3,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineClipboard,
  HiOutlineCog6Tooth,
  HiOutlineEnvelope,
  HiOutlineEnvelopeOpen,
  HiOutlineExclamationTriangle,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineFlag,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlineLightBulb,
  HiOutlineMegaphone,
  HiOutlineMoon,
  HiOutlinePrinter,
  HiOutlineSun,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineXMark,
  HiLanguage,
} from 'react-icons/hi2';
import { IoBugOutline } from 'react-icons/io5';

/**
 * Icon component for the application
 * Only includes icons that are currently in use
 */
export const ICONS = {
  about: HiOutlineInformationCircle,
  alert: HiOutlineExclamationTriangle,
  announcement: HiOutlineMegaphone,
  announcements: HiOutlineMegaphone,
  back: HiOutlineChevronLeft,
  chevronDown: HiOutlineChevronDown,
  copy: HiOutlineClipboard,
  box: HiOutlineArchiveBox,
  boxes: HiOutlineArchiveBox,
  bug: IoBugOutline,
  close: HiOutlineXMark,
  day: HiOutlineSun,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  group: HiOutlineUsers,
  heart: HiOutlineHeart,
  home: HiOutlineHome,
  idea: HiOutlineLightBulb,
  ideas: HiOutlineLightBulb,
  info: HiOutlineInformationCircle,
  language: HiLanguage,
  logout: HiOutlineArrowRightEndOnRectangle,
  menu: HiOutlineBars3,
  message: HiOutlineEnvelope,
  messages: HiOutlineEnvelopeOpen,
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
  // Provide aria-label to make the icon semantic; omit to treat it as decorative
}

/**
 * Renders SVG icon by given icon name
 * Optimized for SVG rendering with proper accessibility support
 * @component Icon
 */
const Icon: React.FC<Props> = React.forwardRef<SVGSVGElement, Props>(
  ({ type, size = '1em', className, 'aria-label': ariaLabel, ...restOfProps }, ref) => {
    if (!(type in ICONS)) return null;

    const semantic = !!ariaLabel;

    return React.createElement(ICONS[type], {
      ref,
      size,
      className: `app-icon ${className ?? ''}`,
      role: semantic ? 'img' : undefined,
      'aria-hidden': semantic ? undefined : 'true',
      'aria-label': ariaLabel,
      ...restOfProps,
    } as IconBaseProps);
  }
);

Icon.displayName = 'Icon';

export default memo(Icon);
