import { FunctionComponent, MouseEventHandler } from 'react';
import List from '@mui/material/List';
import SideBarNavItem from './SideBarNavItem';
import { LinkToPage } from '@/types/PageLinks';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { AppIcon, AppLink } from '@/components';
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
  return (
    <List component="nav" {...restOfProps}>
      {items.map(({ icon, path, title }) => (
        <ListItemButton
          key={`${title}-${path}`}
          component={AppLink}
          to={path}
          href="" // Hard reset for .href property, otherwise links are always opened in new tab :(
          openInNewTab={false}
          onClick={onClick}
        >
          <ListItemIcon>{icon && <AppIcon icon={icon} />}</ListItemIcon>
          <ListItemText primary={t(`views.${title}`)} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default SideBarNavList;
