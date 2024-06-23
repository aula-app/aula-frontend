import { IconButton, Stack, Typography } from '@mui/material';
import { AppIcon } from '..';
import { MessageConfigsType, MessageTypes } from '@/types/MessageTypes';
import { cyan, deepPurple, red } from '@mui/material/colors';

/**
 * Renders "MessageCard" component
 */

interface Props {
  type: MessageTypes;
}

const messageConfig = {
  message: {
    icon: 'message',
    color: cyan
  },
  announcement: {
    icon: 'bell',
    color: deepPurple
  },
  alert: {
    icon: 'alert',
    color: red
  }
} as MessageConfigsType

const MessageCard = ({ type }: Props) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      borderRadius={5}
      p={2}
      mb={1}
      bgcolor={messageConfig[type].color[100]}
      color={messageConfig[type].color[800]}
    >
      <AppIcon name={messageConfig[type].icon} />
      <Typography flex={1} px={2}>
        message
      </Typography>
      <IconButton size="small">
        <AppIcon name="close" />
      </IconButton>
    </Stack>
  );
};

export default MessageCard;
