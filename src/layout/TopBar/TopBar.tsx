import { AppIcon, AppIconButton, AppLink } from '@/components';
import { AppBar, Breadcrumbs, Toolbar } from '@mui/material';
import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import SideBar from '../SideBar';
import { SIDEBAR_DESKTOP_ANCHOR } from '../config';

interface Props {
  home: string;
  setReport: Dispatch<SetStateAction<'bug' | 'report' | undefined>>;
}

/**
 * Renders TopBar composition
 * @component TopBar
 */
const TopBar = ({ home, setReport, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  const [openSideBar, setSidebar] = useState(false);
  const location = useLocation().pathname.split('/');
  const displayPath = location
    .filter((curPath) => /.*[A-Za-z\s]+.*/.test(curPath))
    .filter((curPath) => !['welcome', 'phase', 'settings'].includes(curPath));
  const goto = useNavigate();

  const menuToggle = () => setSidebar(!openSideBar);

  const returnLocation = () =>
    location.length !== 5 ? location.splice(0, location.length - 2) : location.splice(0, location.length - 4);

  return (
    <AppBar elevation={0}>
      <Toolbar>
        {location[1] === 'welcome' ? (
          <AppIcon icon="logo" size="large" sx={{ mr: 1 }} />
        ) : (
          <AppIconButton icon="back" onClick={() => goto(returnLocation().join('/'))} />
        )}

        <Breadcrumbs aria-label="breadcrumb" sx={{ flexGrow: 1, textAlign: 'center' }}>
          <AppLink underline="hover" color="inherit" to="/">
            Aula
          </AppLink>
          {displayPath.map((currentPath, key) => {
            const link = location.slice(0, 2 * (key + 1) + (currentPath === 'messages' ? 0 : 3)).join('/');
            return (
              <AppLink underline="hover" color="inherit" to={`${link}`} key={key}>
                {t(`views.${currentPath}`)}
              </AppLink>
            );
          })}
        </Breadcrumbs>

        <AppIconButton icon="menu" onClick={menuToggle} sx={{ display: { xs: 'block', md: 'none' } }} />
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
