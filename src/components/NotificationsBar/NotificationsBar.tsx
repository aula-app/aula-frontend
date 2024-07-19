import { Campaign, Favorite, Mail, Notifications } from '@mui/icons-material';
import { ButtonGroup, IconButton } from '@mui/material';

export const NotificationsBar = () => {
  return (
    <ButtonGroup size="large" aria-label="large button group" className="noPrint">
      <IconButton size="large">
        <Notifications />
      </IconButton>
      <IconButton size="large">
        <Campaign />
      </IconButton>
      <IconButton size="large">
        <Mail />
      </IconButton>
      <IconButton size="large">
        <Favorite />
      </IconButton>
    </ButtonGroup>
  );
};

export default NotificationsBar;
