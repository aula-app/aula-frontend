import { FunctionComponent } from 'react';
import LogoIcon from './logo.svg?react';
import VotingIcon from './voting.svg?react';
import CircleIcon from './circle.svg?react';
import {
  AcademicCapIcon,
  ArchiveBoxIcon,
  ArrowRightEndOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  CameraIcon,
  ChatBubbleLeftIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ClockIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  FunnelIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  HeartIcon,
  HomeIcon,
  InformationCircleIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  MinusCircleIcon,
  MoonIcon,
  PlusIcon,
  PresentationChartBarIcon,
  PrinterIcon,
  QuestionMarkCircleIcon,
  SunIcon,
  TrashIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartFullIcon } from '@heroicons/react/24/solid'
import { Stack } from '@mui/material';
import { ObjectPropByName } from '@/types/Generics';

/**
 * How to use:
 * 1. Import all required MUI or other SVG icons into this file.
 * 2. Add icons with "unique lowercase names" into ICONS object.
 * 3. Use icons everywhere in the App by their names in <AppIcon name="xxx" /> component
 * Important: properties of ICONS object MUST be lowercase!
 * Note: You can use camelCase or UPPERCASE in the <AppIcon name="someIconByName" /> component
 */
const ICONS: Record<string, React.ComponentType> = {
  logo: LogoIcon,
  account: UserCircleIcon,
  add: PlusIcon,
  against: XCircleIcon,
  alert: ExclamationTriangleIcon,
  arrowdown: ChevronDownIcon,
  approval: QuestionMarkCircleIcon,
  approved: HandThumbUpIcon,
  avatar: UserCircleIcon,
  back: ChevronLeftIcon,
  bell: BellIcon,
  box: ArchiveBoxIcon,
  camera: CameraIcon,
  cancel: XCircleIcon,
  chart: PresentationChartBarIcon,
  chat: ChatBubbleLeftIcon,
  check: CheckCircleIcon,
  close: XMarkIcon,
  clock: ClockIcon,
  day: SunIcon,
  delete: TrashIcon,
  discussion: ChatBubbleLeftRightIcon,
  filter: FunnelIcon,
  for: CheckCircleIcon,
  forbid: MinusCircleIcon,
  group: UsersIcon,
  heart: HeartIcon,
  heartfull: HeartFullIcon,
  home: HomeIcon,
  idea: LightBulbIcon,
  info: InformationCircleIcon,
  login: UserIcon,
  logout: ArrowRightEndOnRectangleIcon,
  menu: Bars3Icon,
  message: EnvelopeIcon,
  neutral: CircleIcon,
  night: MoonIcon,
  notifications: BellIcon,
  print: PrinterIcon,
  rejected: HandThumbDownIcon,
  room: AcademicCapIcon,
  search: MagnifyingGlassIcon,
  settings: Cog6ToothIcon,
  signup: UserPlusIcon,
  text: DocumentTextIcon,
  users: UserGroupIcon,
  visibilityoff: EyeIcon,
  visibilityon: EyeSlashIcon,
  vote: VotingIcon
};

export type IconType = keyof typeof ICONS;

interface Props {
  name?: keyof typeof ICONS; // Icon's name
  icon?: keyof typeof ICONS; // Icon's name alternate prop
  size?: 'small' | 'medium' | 'large' | 'xl' | 'full'; // Icon's name alternate prop,
  sx?: ObjectPropByName;
}

/**
 * Renders SVG icon by given Icon name
 * @component AppIcon
 * @param {string} [props.name] - name of the Icon to render
 * @param {string} [props.icon] - name of the Icon to render
 */
const AppIcon: FunctionComponent<Props> = ({ name, icon, size = 'md', sx, ...restOfProps }) => {
  const iconName = (name || icon || 'default').trim().toLowerCase();
  const ComponentToRender = ICONS[iconName] || ICONS.default;
  const currentSize =
    size === 'small'
      ? '16px'
    : size === 'large'
      ? '32px'
    : size === 'xl'
      ? '40px'
    : size === 'full'
      ? '100%'
      : '24px'; // no size === md
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ minWidth: currentSize, width: currentSize, height: currentSize, ...sx }}>
      <ComponentToRender {...restOfProps} />
    </Stack>
  );
};

export default AppIcon;
