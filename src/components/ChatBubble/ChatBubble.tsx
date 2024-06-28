import { Box, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import MoreOptions from '../MoreOptions';

interface ChatBubbleProps {
  color: string;
  children: React.ReactElement | string | number;
  disabled?: boolean;
}

export const ChatBubble = ({ color, children, disabled = false }: ChatBubbleProps) => (
  <Stack
    sx={{
      color: disabled ? grey[700] : 'inherit',
      background: color,
      mb: 2,
      borderRadius: 5,
      position: 'relative',
    }}
  >
    <Box p={2} pb={0}>{children}</Box>
    <Stack direction="row" justifyContent="end">
      <MoreOptions />
    </Stack>
    <Box
      className="noPrint point"
      sx={{
        position: 'absolute',
        bottom: 0,
        left: '1.75rem',
        width: '1rem',
        aspectRatio: 1,
        background: color,
        transform: 'translateY(100%)',
      }}
    />
  </Stack>
);

export default ChatBubble;
