import { FunctionComponent } from 'react';
import LogoIcon from './logo.svg?react';
import {
  AccountCircleOutlined,
  ArrowBackIosNew,
  Brightness3,
  Brightness4,
  Brightness5,
  Close,
  ExitToApp,
  Group,
  Home,
  InboxOutlined,
  Info,
  Lightbulb,
  ManageAccounts,
  MeetingRoom,
  Menu,
  MoreHoriz,
  Notifications,
  Person,
  PersonAdd,
  Print,
  Search,
  Settings,
  VerifiedUser,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

/**
 * How to use:
 * 1. Import all required MUI or other SVG icons into this file.
 * 2. Add icons with "unique lowercase names" into ICONS object.
 * 3. Use icons everywhere in the App by their names in <AppIcon name="xxx" /> component
 * Important: properties of ICONS object MUST be lowercase!
 * Note: You can use camelCase or UPPERCASE in the <AppIcon name="someIconByName" /> component
 */
const ICONS: Record<string, React.ComponentType> = {
  default: MoreHoriz,
  logo: LogoIcon,
  account: AccountCircleOutlined,
  back: ArrowBackIosNew,
  box: InboxOutlined,
  close: Close,
  day: Brightness5,
  daynight: Brightness4,
  group: Group,
  home: Home,
  idea: Lightbulb,
  info: Info,
  login: Person,
  logout: ExitToApp,
  menu: Menu,
  night: Brightness3,
  notifications: Notifications,
  print: Print,
  room: MeetingRoom,
  search: Search,
  settings: Settings,
  signup: PersonAdd,
  texts: VerifiedUser,
  users: ManageAccounts,
  visibilityoff: VisibilityOff,
  visibilityon: Visibility,
};

interface Props {
  name?: string; // Icon's name
  icon?: string; // Icon's name alternate prop
}

/**
 * Renders SVG icon by given Icon name
 * @component AppIcon
 * @param {string} [props.name] - name of the Icon to render
 * @param {string} [props.icon] - name of the Icon to render
 */
const AppIcon: FunctionComponent<Props> = ({ name, icon, ...restOfProps }) => {
  const iconName = (name || icon || 'default').trim().toLowerCase();
  const ComponentToRender = ICONS[iconName] || ICONS.default;
  return <ComponentToRender {...restOfProps} />;
};

export default AppIcon;
