import { AppIcon, AppLink } from '@/components';
import { checkPermissions } from '@/utils';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import List from '@mui/material/List';
import { Fragment, FunctionComponent, MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_ITEMS } from '../config';

interface Props {
  onClick?: MouseEventHandler;
}

/**
 * Renders list of Navigation Items inside SideBar
 * @component SideBarNavList
 * @param {array} items - list of objects to render as navigation items
 * @param {boolean} [showIcons] - icons in navigation items are visible when true
 * @param {function} [onAfterLinkClick] - optional callback called when some navigation item was clicked
 */
const SideBarNavList: FunctionComponent<Props> = ({ onClick, ...restOfProps }) => {
  const { t } = useTranslation();

  return (
    <List component="nav" {...restOfProps} sx={{ flex: 1, px: 1 }}>
      {SIDEBAR_ITEMS.map(({ icon, path, title, role }) => (
        <Fragment key={`${title}-${path}`}>
          {checkPermissions(role) && (
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
