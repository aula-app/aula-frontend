import { AppIcon, AppIconButton, AppLink } from '@/components';
import { AppBar, Breadcrumbs, Toolbar } from '@mui/material';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  home: string;
  menuToggle: () => void;
}

/**
 * Renders TopBar composition
 * @component TopBar
 */
const TopBar: FunctionComponent<Props> = ({ home, menuToggle, ...restOfProps }) => {
  const { t } = useTranslation();
  const location = useLocation().pathname.split('/');
  const displayPath = location
    .filter((curPath) => /.*[A-Za-z\s]+.*/.test(curPath))
    .filter((curPath) => !['welcome', 'phase', 'settings'].includes(curPath));
  const goto = useNavigate();

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

        <AppIconButton icon="menu" onClick={menuToggle} />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
