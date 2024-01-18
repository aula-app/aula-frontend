import { Grid, IconButton } from '@mui/material';
import { Campaign, Favorite, Mail, Notifications } from '@mui/icons-material';

export const NotificationsBar = () => {
  return (
    <Grid display="flex" justifyContent="space-between">
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
    </Grid>
  );
};

export default NotificationsBar;
