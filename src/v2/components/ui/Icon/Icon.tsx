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
  HiOutlineSun,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineXCircle,
  HiOutlineXMark,
  HiBold,
  HiItalic,
  HiListBullet,
  HiNumberedList,
  HiArrowUturnLeft,
  HiArrowUturnRight,
  HiStrikethrough,
  HiLink,
} from 'react-icons/hi2';
import voting from './voting.svg?react';

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
  approval: HiOutlineQuestionMarkCircle,
  bold: HiBold,
  check: HiOutlineCheck,
  edit: HiOutlinePencilSquare,
  error: HiOutlineXCircle,
  announcement: HiOutlineMegaphone,
  announcements: HiOutlineMegaphone,
  back: HiOutlineChevronLeft,
  chevronDown: HiOutlineChevronDown,
  copy: HiOutlineDocumentDuplicate,
  confirm: HiOutlineCheck,
  box: HiOutlineArchiveBox,
  boxes: HiOutlineArchiveBox,
  bug: HiOutlineBugAnt,
  close: HiOutlineXMark,
  day: HiOutlineSun,
  discussion: HiOutlineChatBubbleLeftRight,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  group: HiOutlineUsers,
  heart: HiOutlineHeart,
  home: HiOutlineHome,
  idea: HiOutlineLightBulb,
  ideas: HiOutlineLightBulb,
  info: HiOutlineInformationCircle,
  italic: HiItalic,
  language: HiLanguage,
  list: HiListBullet,
  logout: HiOutlineArrowRightEndOnRectangle,
  menu: HiOutlineBars3,
  message: HiOutlineEnvelope,
  messages: HiOutlineEnvelopeOpen,
  night: HiOutlineMoon,
  numbered: HiNumberedList,
  print: HiOutlinePrinter,
  report: HiOutlineFlag,
  reports: HiOutlineFlag,
  request: HiOutlineExclamationTriangle,
  requests: HiOutlineExclamationTriangle,
  results: HiOutlineChartBar,
  room: HiOutlineAcademicCap,
  rooms: HiOutlineAcademicCap,
  settings: HiOutlineCog6Tooth,
  user: HiOutlineUser,
  users: HiOutlineUserGroup,
  voting: VotingIcon,
  wild: HiOutlineLightBulb,
  undo: HiArrowUturnLeft,
  redo: HiArrowUturnRight,
  strikethrough: HiStrikethrough,
  link: HiLink,
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
