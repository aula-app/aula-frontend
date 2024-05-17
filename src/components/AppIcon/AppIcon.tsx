import { FunctionComponent } from 'react';
import LogoIcon from './logo.svg?react';
<<<<<<< Updated upstream
import AccountCircle from '@mui/icons-material/AccountCircle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';
import DayIcon from '@mui/icons-material/Brightness5';
import DayNightIcon from '@mui/icons-material/Brightness4';
import DefaultIcon from '@mui/icons-material/MoreHoriz';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import MenuIcon from '@mui/icons-material/Menu';
import NightIcon from '@mui/icons-material/Brightness3';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Print } from '@mui/icons-material';
=======
import VotingIcon from './voting.svg?react';
import {
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  ArrowRightEndOnRectangleIcon,
  BellIcon,
  CameraIcon,
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
  InboxIcon,
  InformationCircleIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  MinusCircleIcon,
  MoonIcon,
  PlusIcon,
  PresentationChartBarIcon,
  PrinterIcon,
  StarIcon,
  SunIcon,
  TrashIcon,
  UserCircleIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Box } from '@mui/material';
import { ObjectPropByName } from '@/types/Generics';
>>>>>>> Stashed changes

/**
 * How to use:
 * 1. Import all required MUI or other SVG icons into this file.
 * 2. Add icons with "unique lowercase names" into ICONS object.
 * 3. Use icons everywhere in the App by their names in <AppIcon name="xxx" /> component
 * Important: properties of ICONS object MUST be lowercase!
 * Note: You can use camelCase or UPPERCASE in the <AppIcon name="someIconByName" /> component
 */
const ICONS: Record<string, React.ComponentType> = {
<<<<<<< Updated upstream
  default: DefaultIcon,
  logo: LogoIcon,
  account: AccountCircle,
  back: ArrowBackIosNewIcon,
  close: CloseIcon,
  day: DayIcon,
  daynight: DayNightIcon,
  group: GroupIcon,
  home: HomeIcon,
  idea: LightbulbIcon,
  info: InfoIcon,
  login: PersonIcon,
  logout: ExitToAppIcon,
  menu: MenuIcon,
  night: NightIcon,
  notifications: NotificationsIcon,
  print: Print,
  room: MeetingRoomIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  signup: PersonAddIcon,
  texts: VerifiedUserIcon,
  users: ManageAccountsIcon,
  visibilityoff: VisibilityOffIcon,
  visibilityon: VisibilityIcon,
=======
  logo: LogoIcon,
  add: PlusIcon,
  account: UserCircleIcon,
  approval: StarIcon,
  arrowdown: ChevronDownIcon,
  back: ChevronLeftIcon,
  box: InboxIcon,
  camera: CameraIcon,
  cancel: XCircleIcon,
  chat: ChatBubbleLeftRightIcon,
  chart: PresentationChartBarIcon,
  check: CheckCircleIcon,
  close: XMarkIcon,
  day: SunIcon,
  delete: TrashIcon,
  envelope: EnvelopeIcon,
  forbid: MinusCircleIcon,
  group: UsersIcon,
  home: HomeIcon,
  heart: HeartIcon,
  idea: LightBulbIcon,
  info: InformationCircleIcon,
  login: UserIcon,
  logout: ArrowRightEndOnRectangleIcon,
  menu: AdjustmentsHorizontalIcon,
  night: MoonIcon,
  notifications: BellIcon,
  print: PrinterIcon,
  room: AcademicCapIcon,
  search: MagnifyingGlassIcon,
  settings: Cog6ToothIcon,
  signup: UserPlusIcon,
  text: DocumentTextIcon,
  visibilityoff: EyeIcon,
  visibilityon: EyeSlashIcon,
  vote: VotingIcon,
>>>>>>> Stashed changes
};

interface Props {
  name?: string; // Icon's name
  icon?: string; // Icon's name alternate prop
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
<<<<<<< Updated upstream
  const ComponentToRender = ICONS[iconName] || DefaultIcon;
  return <ComponentToRender {...restOfProps} />;
=======
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
    <Box sx={{ width: currentSize, height: currentSize, ...sx }}>
      <ComponentToRender {...restOfProps} />
    </Box>
  );
>>>>>>> Stashed changes
};

export default AppIcon;
