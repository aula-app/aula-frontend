import { phases } from '@/utils';
import { Box, Stack, StackProps } from '@mui/material';
import { FC } from 'react';
import { useParams } from 'react-router-dom';

interface ChatBubbleProps extends StackProps {
  children: React.ReactElement | string | number;
  comment?: boolean;
  disabled?: boolean;
}

const ChatBubble: FC<ChatBubbleProps> = ({ 
  children, 
  comment = false, 
  disabled = false,
  ...restOfProps 
}) => {
  const { phase } = useParams();
  const color = comment ? 'comments.main' : `${phases[Number(phase)]}.main`;
  return (
    <Stack
      sx={{
        color: disabled ? 'secondary' : 'inherit',
        bgcolor: color,
        mb: 1,
        borderRadius: 5,
        position: 'relative',
      }}
      {...restOfProps}
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
