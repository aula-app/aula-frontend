import { ButtonGroup, IconButton } from '@mui/material';
import { Campaign, Favorite, Mail, Notifications } from '@mui/icons-material';

export const NotificationsBar = () => {
  return (
    <ButtonGroup size="large" aria-label="large button group" className='noPrint'>
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
