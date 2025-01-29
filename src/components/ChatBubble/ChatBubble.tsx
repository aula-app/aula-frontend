import { phases } from '@/utils';
import { Box, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';

interface ChatBubbleProps {
  children: React.ReactElement | string | number;
  comment?: boolean;
  disabled?: boolean;
}

const ChatBubble = ({ children, comment = false, disabled = false }: ChatBubbleProps) => {
  const { phase } = useParams();
  const color = disabled || comment ? 'disabled.main' : `${phases[Number(phase)]}.main`;
  return (
    <Stack
      sx={{
        color: disabled ? 'secondary' : 'inherit',
        bgcolor: color,
        mb: 1,
        borderRadius: 5,
        position: 'relative',
      }}
    >
      <Box px={3} py={2}>
        {children}
      </Box>
      {(comment || Number(phase) < 10) && (
        <Box
          className="point"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '32px',
            width: '1rem',
            aspectRatio: 1,
            bgcolor: color,
            transform: 'translateY(100%)',
          }}
        />
      )}
    </Stack>
  );
};

export default ChatBubble;
