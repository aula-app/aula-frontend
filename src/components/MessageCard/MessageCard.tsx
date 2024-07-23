import { MessageConsentValues } from '@/utils';
import { IconButton, Stack, Typography } from '@mui/material';
import { AppIcon } from '..';

/**
 * Renders "MessageCard" component
 */

interface Props {
  type: MessageConsentValues;
  title: string;
}

const MessageCard = ({ type, title }: Props) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      borderRadius={5}
      p={1}
      pl={2}
      mb={1}
      bgcolor={`${type}.main`}
      // color={messageConfig[type].color[800]}
    >
      <AppIcon icon={type} />
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
