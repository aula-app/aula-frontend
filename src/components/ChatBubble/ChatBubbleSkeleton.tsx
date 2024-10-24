import { Skeleton, Stack } from '@mui/material';

const ChatBubbleSkeleton = () => (
  <Stack
    sx={{
      mb: 2,
      position: 'relative',
    }}
  >
    <Skeleton variant="rectangular" height={135} sx={{ borderRadius: 5 }} />
    <Skeleton
      className="point"
      variant="rectangular"
      sx={{
        position: 'absolute',
        bottom: 0,
        left: '45px',
        width: '1rem',
        aspectRatio: 1,
        transform: 'translateY(100%)',
      }}
    />
  </Stack>
);

export default ChatBubbleSkeleton;
