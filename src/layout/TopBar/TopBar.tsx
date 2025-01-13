import { AppIcon, AppIconButton, AppLink } from '@/components';
import { AppBar, Breadcrumbs, Stack, Toolbar } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import SideBar from '../SideBar';
import { SIDEBAR_DESKTOP_ANCHOR } from '../config';
import { checkPermissions } from '@/utils';
import { useEventLogout, useOnMobile } from '@/hooks';
import LocaleSwitch from '@/components/LocaleSwitch';

// Role required for admin features
const TECH_ADMIN_ROLE = 60;

// Paths that should be excluded from breadcrumbs
const EXCLUDED_PATHS = ['welcome', 'phase', 'settings'];

interface Props {
  /** Home path for navigation */
  home: string;
  /** Callback to set the type of report */
  setReport: Dispatch<SetStateAction<'bug' | 'report' | undefined>>;
}

/**
 * TopBar component that provides navigation, breadcrumbs, and user controls
 * @component TopBar
 */
const TopBar = ({ home, setReport }: Props) => {
  const { t } = useTranslation();
  const [openSideBar, setSidebar] = useState(false);
  const location = useLocation().pathname.split('/');
  const onLogout = useEventLogout();
  const onMobile = useOnMobile();
  const goto = useNavigate();

  // Filter valid paths for breadcrumbs
  const displayPath = location
    .filter((path) => path.trim().length > 0) // Remove empty paths
    .filter((path) => !EXCLUDED_PATHS.includes(path));

  const menuToggle = () => setSidebar(!openSideBar);

  // Calculate return path based on current location
  const getReturnPath = () => {
    const pathSegments = [...location];
    const segmentsToRemove = pathSegments.length >= 5 ? 4 : 2;
    return pathSegments.slice(0, -segmentsToRemove).join('/');
  };

  return (
    <AppBar elevation={0}>
      <Toolbar>
        {/* Logo or Back Button */}
        {location[1] === '' ? (
          <AppIcon icon="logo" size="large" sx={{ mr: 1 }} />
        ) : (
          <AppIconButton icon="back" onClick={() => goto(getReturnPath())} />
        )}

        {/* Navigation Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ flexGrow: 1, textAlign: 'center' }}>
          <AppLink underline="hover" color="inherit" to="/">
            aula
          </AppLink>
          {displayPath.map((currentPath, index) => {
            // Calculate path segments for current breadcrumb
            const pathDepth = index + 1;
            const extraSegments = currentPath === 'messages' ? 0 : 3;
            const link = location.slice(0, 2 * pathDepth + extraSegments).join('/');

            return (
              <AppLink underline="hover" color="inherit" to={link} key={index}>
                {t(`views.${currentPath}`)}
              </AppLink>
            );
          })}
        </Breadcrumbs>

        {/* User Controls */}
        {checkPermissions(TECH_ADMIN_ROLE) ? (
          <Stack direction="row">
            <LocaleSwitch />
            <AppIconButton icon="logout" onClick={onLogout} />
          </Stack>
        ) : (
          <AppIconButton icon="menu" onClick={menuToggle} sx={{ display: { xs: 'block', md: 'none' } }} />
        )}
        <SideBar
          anchor={SIDEBAR_DESKTOP_ANCHOR}
          open={openSideBar}
          variant="temporary"
          setReport={setReport}
          onClose={() => setSidebar(false)}
        />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
