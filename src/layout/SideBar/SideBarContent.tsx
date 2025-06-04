import { AppIcon, AppLink } from '@/components';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Fragment, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_ITEMS } from '../config';

type Props = {
  isFixed?: boolean;
  onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
};

/**
 * Renders SideBar content including navigation, actions and user controls
 * @component SideBarContent
 * @param {boolean} [props.isFixed] - Whether the sidebar is fixed or in a drawer
 * @param {function} [props.onClose] - Optional callback when drawer closes
 * @returns {JSX.Element} Rendered SideBarContent component
 */
const SideBarContent = ({ isFixed = false, onClose = () => {}, ...restOfProps }: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <List component="nav" {...restOfProps} sx={{ flex: 1, px: 1, overflow: 'auto' }}>
      {SIDEBAR_ITEMS.map(({ icon, path, title, permission }) => (
        <Fragment key={`${title}-${path}`}>
          {permission() && (
            <ListItemButton
              component={AppLink}
              to={path}
              href="" // Hard reset for .href property, otherwise links are always opened in new tab :(
              openInNewTab={false}
            >
              <ListItemIcon>{icon && <AppIcon icon={icon} />}</ListItemIcon>
              <ListItemText primary={t(`ui.navigation.${title}`)} />
            </ListItemButton>
          )}
        </Fragment>
      ))}
    </List>
  );
};

export default memo(SideBarContent);
