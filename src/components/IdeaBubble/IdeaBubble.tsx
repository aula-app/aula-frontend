import { Box, Stack, Typography } from '@mui/material';

interface IdeaBubbleProps {
  title?: string;
  text: string;
}

export const IdeaBubble = ({title, text}: IdeaBubbleProps) => {
  return (
    <Stack pl={2} mb={1}>
      <Box sx={{ background: '#ccc', p: 4, borderRadius: 15, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 30,
            height: 30,
            border: '15px solid #ccc',
            borderTopColor: 'transparent',
            borderLeftColor: 'transparent',
            transform: 'rotate(-25deg)'
          }}
        />
        { title &&
          <Typography variant="h6" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap" mb={2}>
            {title}
          </Typography>
        }
        {text}
      </Box>
    </Stack>
  );
};

export default IdeaBubble;
