import { FunctionComponent } from 'react';
import LogoIcon from './logo.svg?react';
import VotingIcon from './voting.svg?react';
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
  Cog6ToothIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
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
import { Box } from '@mui/material';
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
  add: PlusIcon,
  account: UserCircleIcon,
  arrowdown: ChevronDownIcon,
  approval: QuestionMarkCircleIcon,
  avatar: UserCircleIcon,
  back: ChevronLeftIcon,
  box: ArchiveBoxIcon,
  camera: CameraIcon,
  cancel: XCircleIcon,
  chat: ChatBubbleLeftIcon,
  chart: PresentationChartBarIcon,
  check: CheckCircleIcon,
  close: XMarkIcon,
  day: SunIcon,
  delete: TrashIcon,
  discussion: ChatBubbleLeftRightIcon,
  envelope: EnvelopeIcon,
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
  night: MoonIcon,
  notifications: BellIcon,
  print: PrinterIcon,
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

interface Props {
  name?: keyof typeof ICONS; // Icon's name
  icon?: keyof typeof ICONS; // Icon's name alternate prop
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Icon's name alternate prop,
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
    size === 'sm'
      ? '16px'
      : size === 'lg'
        ? '32px'
        : size === 'xl'
          ? '40px' // size === xl
          : '24px'; // no size === md
  return (
    <Box sx={{ minWidth: currentSize, width: currentSize, height: currentSize, ...sx }}>
      <ComponentToRender {...restOfProps} />
    </Box>
  );
};

export default AppIcon;
