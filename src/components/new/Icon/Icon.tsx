import React, { memo } from 'react';
import { IconBaseProps } from 'react-icons';
import {
  HiOutlineAcademicCap,
  HiOutlineArchiveBox,
  HiOutlineArrowRightEndOnRectangle,
  HiOutlineBarsArrowDown,
  HiOutlineBarsArrowUp,
  HiOutlineBars3,
  HiOutlineCheckCircle,
  HiOutlineChevronLeft,
  HiOutlineCog6Tooth,
  HiOutlineEnvelope,
  HiOutlineEnvelopeOpen,
  HiOutlineEquals,
  HiOutlineExclamationTriangle,
  HiOutlineFlag,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlineLightBulb,
  HiOutlineLinkSlash,
  HiOutlineMagnifyingGlass,
  HiOutlineMegaphone,
  HiOutlineMoon,
  HiOutlinePlus,
  HiOutlinePlusCircle,
  HiOutlinePrinter,
  HiOutlineSun,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineXCircle,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { IoBugOutline } from 'react-icons/io5';
import { MdCloudSync, MdDragIndicator } from 'react-icons/md';

/**
 * Icon component for the application
 * Only includes icons that are currently in use
 */
export const ICONS = {
  about: HiOutlineInformationCircle,
  add: HiOutlinePlusCircle,
  announcement: HiOutlineMegaphone,
  announcements: HiOutlineMegaphone,
  back: HiOutlineChevronLeft,
  box: HiOutlineArchiveBox,
  boxes: HiOutlineArchiveBox,
  bug: IoBugOutline,
  check: HiOutlineCheckCircle,
  close: HiOutlineXMark,
  cloudSync: MdCloudSync,
  day: HiOutlineSun,
  drag: MdDragIndicator,
  equals: HiOutlineEquals,
  error: HiOutlineXCircle,
  group: HiOutlineUsers,
  heart: HiOutlineHeart,
  home: HiOutlineHome,
  idea: HiOutlineLightBulb,
  ideas: HiOutlineLightBulb,
  logout: HiOutlineArrowRightEndOnRectangle,
  menu: HiOutlineBars3,
  message: HiOutlineEnvelope,
  messages: HiOutlineEnvelopeOpen,
  night: HiOutlineMoon,
  print: HiOutlinePrinter,
  plus: HiOutlinePlus,
  report: HiOutlineFlag,
  reports: HiOutlineFlag,
  request: HiOutlineExclamationTriangle,
  requests: HiOutlineExclamationTriangle,
  room: HiOutlineAcademicCap,
  search: HiOutlineMagnifyingGlass,
  rooms: HiOutlineAcademicCap,
  settings: HiOutlineCog6Tooth,
  sortAsc: HiOutlineBarsArrowUp,
  sortDesc: HiOutlineBarsArrowDown,
  unlink: HiOutlineLinkSlash,
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
