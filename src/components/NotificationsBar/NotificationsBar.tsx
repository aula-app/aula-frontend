import { ButtonGroup, IconButton } from '@mui/material';
import { Campaign, Favorite, Mail, Notifications } from '@mui/icons-material';

export const NotificationsBar = () => {
  return (
    <ButtonGroup size="large" aria-label="large button group">
      <IconButton size="large" sx={{color: '#000'}}>
        <Notifications />
      </IconButton>
      <IconButton size="large" sx={{color: '#000'}}>
        <Campaign />
      </IconButton>
      <IconButton size="large" sx={{color: '#000'}}>
        <Mail />
      </IconButton>
      <IconButton size="large" sx={{color: '#000'}}>
        <Favorite />
      </IconButton>
    </ButtonGroup>
  );
};

export default NotificationsBar;
