import { ObjectPropByName } from '@/types/Generics';
import {
  HiOutlineAcademicCap,
  HiOutlineArchiveBox,
  HiOutlineArrowRightEndOnRectangle,
  HiOutlineBars3,
  HiOutlineBell,
  HiOutlineBugAnt,
  HiOutlineCamera,
  HiOutlineChartBar,
  HiOutlineChatBubbleLeft,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCheckCircle,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineClock,
  HiOutlineCog6Tooth,
  HiOutlineDocumentText,
  HiOutlineEllipsisHorizontal,
  HiOutlineEnvelope,
  HiOutlineExclamationTriangle,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineFaceSmile,
  HiOutlineFlag,
  HiOutlineFunnel,
  HiOutlineHandThumbDown,
  HiOutlineHandThumbUp,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlineLightBulb,
  HiOutlineMagnifyingGlass,
  HiOutlineMinusCircle,
  HiOutlineMoon,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlinePrinter,
  HiOutlineQuestionMarkCircle,
  HiOutlineSun,
  HiOutlineTrash,
  HiOutlineUserGroup,
  HiOutlineUser,
  HiOutlineUserPlus,
  HiOutlineUsers,
  HiOutlineXCircle,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { HiHeart } from 'react-icons/hi2';
import { Stack } from '@mui/material';
import { FunctionComponent } from 'react';
import CircleIcon from './circle.svg?react';
import LogoIcon from './logo.svg?react';
import VotingIcon from './voting.svg?react';

/**
 * How to use:
 * 1. Import all required MUI or other SVG icons into this file.
 * 2. Add icons with "unique lowercase names" into ICONS object.
 * 3. Use icons everywhere in the App by their names in <AppIcon icon="xxx" /> component
 * Important: properties of ICONS object MUST be lowercase!
 * Note: You can use camelCase or UPPERCASE in the <AppIcon icon="someIconByName" /> component
 */
export const ICONS: Record<string, React.ComponentType> = {
  logo: LogoIcon,
  account: HiOutlineFaceSmile,
  add: HiOutlinePlus,
  against: HiOutlineXCircle,
  alert: HiOutlineExclamationTriangle,
  announcement: HiOutlineBell,
  arrowdown: HiOutlineChevronDown,
  approval: HiOutlineQuestionMarkCircle,
  approved: HiOutlineHandThumbUp,
  avatar: HiOutlineFaceSmile,
  back: HiOutlineChevronLeft,
  bell: HiOutlineBell,
  box: HiOutlineArchiveBox,
  bug: HiOutlineBugAnt,
  camera: HiOutlineCamera,
  cancel: HiOutlineXCircle,
  chart: HiOutlineChartBar,
  chat: HiOutlineChatBubbleLeft,
  check: HiOutlineCheckCircle,
  close: HiOutlineXMark,
  clock: HiOutlineClock,
  cog: HiOutlineCog6Tooth,
  day: HiOutlineSun,
  delete: HiOutlineTrash,
  delegate: HiOutlineUsers,
  discussion: HiOutlineChatBubbleLeftRight,
  edit: HiOutlinePencil,
  filter: HiOutlineFunnel,
  for: HiOutlineCheckCircle,
  forbid: HiOutlineMinusCircle,
  group: HiOutlineUsers,
  heart: HiOutlineHeart,
  heartfull: HiHeart,
  home: HiOutlineHome,
  idea: HiOutlineLightBulb,
  info: HiOutlineInformationCircle,
  login: HiOutlineUser,
  logout: HiOutlineArrowRightEndOnRectangle,
  menu: HiOutlineBars3,
  more: HiOutlineEllipsisHorizontal,
  message: HiOutlineEnvelope,
  neutral: CircleIcon,
  night: HiOutlineMoon,
  notifications: HiOutlineBell,
  print: HiOutlinePrinter,
  results: HiOutlineChartBar,
  rejected: HiOutlineHandThumbDown,
  report: HiOutlineFlag,
  room: HiOutlineAcademicCap,
  search: HiOutlineMagnifyingGlass,
  settings: HiOutlineCog6Tooth,
  signup: HiOutlineUserPlus,
  text: HiOutlineDocumentText,
  users: HiOutlineUserGroup,
  visibilityoff: HiOutlineEye,
  visibilityon: HiOutlineEyeSlash,
  voting: VotingIcon,
  wild: HiOutlineLightBulb,
};

export type IconType = keyof typeof ICONS;

interface Props {
  icon: IconType; // Icon's name alternate prop
  size?: 'small' | 'medium' | 'large' | 'xl' | 'xxl'; // Icon's name alternate prop,
  sx?: ObjectPropByName;
}

/**
 * Renders SVG icon by given Icon name
 * @component AppIcon
 * @param {string} [props.name] - name of the Icon to render
 * @param {string} [props.icon] - name of the Icon to render
 */
const AppIcon: FunctionComponent<Props> = ({ icon, size = 'md', sx, ...restOfProps }) => {
  const ComponentToRender = ICONS[icon] || ICONS.default;
  const currentSize =
    size === 'small' ? '16px' : size === 'large' ? '32px' : size === 'xl' ? '40px' : size === 'xxl' ? '80px' : '24px'; // no size === md
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ fontSize: currentSize, minWidth: currentSize, width: currentSize, height: currentSize, ...sx }}
    >
      <ComponentToRender {...restOfProps} />
    </Stack>
  );
};

export default AppIcon;
