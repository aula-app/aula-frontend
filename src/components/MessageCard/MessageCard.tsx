import { IconButton, Stack, Typography } from '@mui/material';
import { AppIcon } from '..';
import { MessageConfigsType, MessageTypes } from '@/types/scopes/MessageTypes';
import { cyan, deepPurple, red } from '@mui/material/colors';

/**
 * Renders "MessageCard" component
 */

interface Props {
  type: MessageTypes;
  title: string;
}

const messageConfig = {
  message: {
    icon: 'message',
    color: cyan,
  },
  announcement: {
    icon: 'bell',
    color: deepPurple,
  },
  alert: {
    icon: 'alert',
    color: red,
  },
} as MessageConfigsType;

const MessageCard = ({ type, title }: Props) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      borderRadius={5}
      p={1}
      pl={2}
      mb={1}
      bgcolor={messageConfig[type].color[100]}
      color={messageConfig[type].color[800]}
    >
      <AppIcon icon={messageConfig[type].icon} />
      <Typography flex={1} px={2}>
        {title}
      </Typography>
      <IconButton size="small">
        <AppIcon icon="close" />
      </IconButton>
    </Stack>
  );
};

export default MessageCard;
