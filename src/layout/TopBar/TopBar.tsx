import { AppBar, Breadcrumbs, Link, Toolbar } from '@mui/material';
import { FunctionComponent, ReactNode } from 'react';

interface Props {
  home: string;
  path?: string[];
  endNode?: ReactNode;
  startNode?: ReactNode;
}

/**
 * Renders TopBar composition
 * @component TopBar
 */
const TopBar: FunctionComponent<Props> = ({ endNode, startNode, home, path = [], ...restOfProps }) => {
  const displayPath = path.filter((path) => /.*[a-zA-Z].*/.test(path));
  return (
    <AppBar component="div" {...restOfProps}>
      <Toolbar>
        {startNode}

        <Breadcrumbs aria-label="breadcrumb" sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Link underline="hover" color="inherit" href="/">
            {home}
          </Link>
          {displayPath.map((currentPath, key) => {
            const link = path.slice(0, 2 * (key + 1) + 1).join('/');
            return (
              <Link underline="hover" color="inherit" href={`${link}`} key={key}>
                {currentPath}
              </Link>
            );
          })}
        </Breadcrumbs>

        {endNode}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
