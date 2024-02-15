import { ChatBubble, Favorite } from '@mui/icons-material';
import { Box, Stack, Typography, colors } from '@mui/material';

interface IdeaBubbleProps {
  title?: string;
  text: string;
}

const bubbleColor = '#eee';

export const IdeaBubble = ({ title, text }: IdeaBubbleProps) => {
  return (
    <Stack mb={1}>
      <Box sx={{ background: bubbleColor, p: 2, borderRadius: 2, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '25px',
            border: `8px solid ${bubbleColor}`,
            borderBottomColor: 'transparent',
            borderRightColor: 'transparent',
            transformOrigin: 'bottom left',
            transform: 'translateY(100%)',
          }}
        />
        {title && (
          <Typography variant="h6" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap" mb={1}>
            {title}
          </Typography>
        )}
        {text}
      </Box>
      <Stack direction="row" justifyContent="flex-end" alignItems="center" mt={1}>
        <ChatBubble fontSize="small" />
        <Typography variant="caption" pr={1} pl={0.3}>
          3
        </Typography>
        <Favorite fontSize="small" />
        <Typography variant="caption" pr={1} pl={0.3}>
          3
        </Typography>
      </Stack>
    </Stack>
  );
};

export default IdeaBubble;
