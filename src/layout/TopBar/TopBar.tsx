import { AppIcon, AppIconButton } from '@/components';
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
  const displayPath = location.filter((curPath) => /.*[a-zA-Z].*/.test(curPath));
  const goto = useNavigate();

  return (
    <AppBar elevation={0}>
      <Toolbar>
        {location.length <= 2 ? (
          <AppIcon icon="logo" size="large" />
        ) : (
          <AppIconButton icon="back" onClick={() => goto(location.join('/'))} />
        )}

        <Breadcrumbs aria-label="breadcrumb" sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Link underline="hover" color="inherit" href="/">
            {home}
          </Link>
          {displayPath.map((currentPath, key) => {
            const addBoxesPath = location.includes('idea-box') && key === 0 ? '/boxes' : ''; //checks if rooms link must have /boxes to correct tab navigation
            const link = location.slice(0, 2 * (key + 1) + 1).join('/') + addBoxesPath;
            return (
              <Link underline="hover" color="inherit" href={`${link}`} key={key}>
                {currentPath}
              </Link>
            );
          })}
        </Breadcrumbs>

        <AppIconButton icon="menu" onClick={menuToggle} />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
