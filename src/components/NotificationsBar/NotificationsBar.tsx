import { Grid, IconButton } from '@mui/material';
import { Campaign, Favorite, Mail, Notifications } from '@mui/icons-material';

export const NotificationsBar = () => {
  return (
    <Grid display="flex" justifyContent="space-between">
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
    </Grid>
  );
};

export default NotificationsBar;
