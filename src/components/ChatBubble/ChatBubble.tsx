import { Box, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';

interface ChatBubbleProps {
  color: string;
  children: React.ReactElement | string | number;
  disabled: boolean;
}

export const ChatBubble = ({ color, children, disabled }: ChatBubbleProps) => (
  <Stack>
    <Box sx={{
        color: disabled ? grey[700] : 'inherit',
        background: color,
        px: 2,
        pt: 2,
        mb: 1,
        borderRadius: 5,
        position: 'relative' }}>
      {children}
      <Box
        className="noPrint point"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '2.25rem',
          width: '1rem',
          aspectRatio: 1,
          background: color,
          transform: 'translateY(100%)',
        }}
      />
    </Box>
  </Stack>
);

export default ChatBubble;
