import { Box, Stack } from '@mui/material';

interface ChatBubbleProps {
  color: string;
  children: React.ReactElement | string | number;
}

export const ChatBubble = ({ color, children }: ChatBubbleProps) => (
  <Stack>
    <Box sx={{
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
