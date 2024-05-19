import { AppIcon } from '@/components';
import MessageCard from '@/components/MessageCard';
import { IconButton, Stack, Typography } from '@mui/material';

/**
 * Renders "Messages" view
 * url: /messages
 */

const MessagesView = () => {
  return (
    <Stack p={2} sx={{ overflowY: 'auto' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" py={2}>
          Messages
        </Typography>
        <IconButton>
          <AppIcon name="filter" />
        </IconButton>
      </Stack>
      <MessageCard type="message" />
      <MessageCard type="announcement" />
      <MessageCard type="alert" />
    </Stack>
  );
};

export default MessagesView;
