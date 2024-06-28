import { AppIcon, AppIconButton, AppLink } from '@/components';
import { AppBar, Breadcrumbs, Link, Toolbar } from '@mui/material';
import { FunctionComponent } from 'react';
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
  const location = useLocation().pathname.split('/');
  const displayPath = location.filter(curPath => /.*[A-Za-z\s]+.*/.test(curPath)).filter(curPath => curPath !== 'welcome');
  const goto = useNavigate();

  const returnLocation = () => Number(location[location.length - 1]) ? location.splice(0, location.length - 2) : location.splice(0, location.length - 3)

  return (
    <AppBar elevation={0}>
      <Toolbar>
        {location.length <= 2 ? (
          <AppIcon icon="logo" size="large" sx={{mr: 1}} />
        ) : (
          <AppIconButton icon="back" onClick={() => goto(returnLocation().join('/'))} />
        )}

        <Breadcrumbs aria-label="breadcrumb" sx={{ flexGrow: 1, textAlign: 'center' }}>
          <AppLink underline="hover" color="inherit" to="/">
            {home}
          </AppLink>
          {displayPath.map((currentPath, key) => {
            const addBoxesPath = location.includes('idea-box') && key === 0 ? '/boxes' : ''; //checks if rooms link must have /boxes to correct tab navigation
            const link = location.slice(0, 2 * (key + 1) + 1).join('/') + addBoxesPath;
            return (
              <AppLink underline="hover" color="inherit" to={`${link}`} key={key}>
                {currentPath}
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
