import React, { memo } from 'react';
import { IconBaseProps, IconType } from 'react-icons';
import {
  HiLanguage,
  HiOutlineAcademicCap,
  HiOutlineArchiveBox,
  HiOutlineArrowRightEndOnRectangle,
  HiOutlineBars3,
  HiOutlineBugAnt,
  HiOutlineChartBar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineCog6Tooth,
  HiOutlineDocumentDuplicate,
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
  HiOutlinePencilSquare,
  HiOutlinePrinter,
  HiOutlinePlus,
  HiOutlineQuestionMarkCircle,
  HiOutlineShare,
  HiOutlineSun,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineXCircle,
  HiOutlineXMark,
  HiBold,
  HiHeart,
  HiItalic,
  HiListBullet,
  HiNumberedList,
  HiArrowUturnLeft,
  HiArrowUturnRight,
  HiStrikethrough,
  HiLink,
  HiEllipsisHorizontal,
  HiTrash,
  HiOutlineMagnifyingGlass,
} from 'react-icons/hi2';
import voting from './voting.svg?react';
import { BiSortAZ, BiSortZA } from 'react-icons/bi';

const VotingIcon: IconType = ({ size = '1em', color = 'currentColor', style, ...props }) =>
  React.createElement(voting, {
    width: size,
    height: size,
    style: { color, ...style },
    ...props,
  });

/**
 * Icon component for the application
 * Only includes icons that are currently in use
 */
export const ICONS = {
  about: HiOutlineInformationCircle,
  add: HiOutlinePlus,
  alert: HiOutlineExclamationTriangle,
  announcement: HiOutlineMegaphone,
  announcements: HiOutlineMegaphone,
  approval: HiOutlineQuestionMarkCircle,
  back: HiOutlineChevronLeft,
  bold: HiBold,
  box: HiOutlineArchiveBox,
  boxes: HiOutlineArchiveBox,
  bug: HiOutlineBugAnt,
  check: HiOutlineCheck,
  chevronDown: HiOutlineChevronDown,
  close: HiOutlineXMark,
  confirm: HiOutlineCheck,
  copy: HiOutlineDocumentDuplicate,
  day: HiOutlineSun,
  delete: HiTrash,
  discussion: HiOutlineChatBubbleLeftRight,
  edit: HiOutlinePencilSquare,
  error: HiOutlineXCircle,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  group: HiOutlineUsers,
  heart: HiOutlineHeart,
  heartFull: HiHeart,
  home: HiOutlineHome,
  idea: HiOutlineLightBulb,
  ideas: HiOutlineLightBulb,
  info: HiOutlineInformationCircle,
  italic: HiItalic,
  language: HiLanguage,
  link: HiLink,
  list: HiListBullet,
  logout: HiOutlineArrowRightEndOnRectangle,
  menu: HiOutlineBars3,
  message: HiOutlineEnvelope,
  messages: HiOutlineEnvelopeOpen,
  more: HiEllipsisHorizontal,
  night: HiOutlineMoon,
  numbered: HiNumberedList,
  print: HiOutlinePrinter,
  redo: HiArrowUturnRight,
  report: HiOutlineFlag,
  reports: HiOutlineFlag,
  request: HiOutlineExclamationTriangle,
  requests: HiOutlineExclamationTriangle,
  results: HiOutlineChartBar,
  room: HiOutlineAcademicCap,
  rooms: HiOutlineAcademicCap,
  settings: HiOutlineCog6Tooth,
  search: HiOutlineMagnifyingGlass,
  share: HiOutlineShare,
  sortAsc: BiSortAZ,
  sortDesc: BiSortZA,
  strikethrough: HiStrikethrough,
  undo: HiArrowUturnLeft,
  user: HiOutlineUser,
  users: HiOutlineUserGroup,
  voting: VotingIcon,
  wild: HiOutlineLightBulb,
};

export type ICON_TYPE = keyof typeof ICONS;

interface Props extends React.SVGAttributes<SVGElement> {
  type: ICON_TYPE;
  size?: string | number;
}

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
