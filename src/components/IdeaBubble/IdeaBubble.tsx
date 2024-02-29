import { ChatBubble, Favorite } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';

interface IdeaBubbleProps {
  title?: string;
  text: string;
  isComment?: boolean;
}

export const IdeaBubble = ({ title, text, isComment = false }: IdeaBubbleProps) => {
  return (
    <Stack pl={2} mb={1}>
      <Box sx={{ background: '#fff', px: 4, py: 2, borderRadius: 15, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 30,
            height: 30,
            border: '15px solid #fff',
            borderTopColor: 'transparent',
            borderLeftColor: 'transparent',
            transform: 'rotate(-25deg)',
          }}
        />
        {title && (
          <Typography variant="h6" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap" mb={1}>
            {title}
          </Typography>
        )}
        {text}
        {!isComment && (
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
        )}
      </Box>
    </Stack>
  );
};

export default IdeaBubble;
