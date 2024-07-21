import { AppIcon, AppLink } from '@/components';
import { LinkToPage } from '@/types/PageLinks';
import { localStorageGet, parseJwt } from '@/utils';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import List from '@mui/material/List';
import { Fragment, FunctionComponent, MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  items: Array<LinkToPage>;
  showIcons?: boolean;
  onClick?: MouseEventHandler;
}

/**
 * Renders list of Navigation Items inside SideBar
 * @component SideBarNavList
 * @param {array} items - list of objects to render as navigation items
 * @param {boolean} [showIcons] - icons in navigation items are visible when true
 * @param {function} [onAfterLinkClick] - optional callback called when some navigation item was clicked
 */
const SideBarNavList: FunctionComponent<Props> = ({ items, showIcons, onClick, ...restOfProps }) => {
  const { t } = useTranslation();
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  return (
    <List component="nav" {...restOfProps} sx={{ flex: 1 }}>
      {items.map(({ icon, path, title, role }) => (
        <Fragment key={`${title}-${path}`}>
          {jwt_payload.user_level >= role && (
            <ListItemButton
              component={AppLink}
              to={path}
              href="" // Hard reset for .href property, otherwise links are always opened in new tab :(
              openInNewTab={false}
              onClick={onClick}
            >
              <ListItemIcon>{icon && <AppIcon icon={icon} />}</ListItemIcon>
              <ListItemText primary={t(`views.${title}`)} />
            </ListItemButton>
          )}
        </Fragment>
      ))}
    </List>
  );
};

export default SideBarNavList;
