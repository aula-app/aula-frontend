import ChatBubbleSkeleton from '@/components/ChatBubble/ChatBubbleSkeleton';
import { Skeleton, Stack } from '@mui/material';

const IdeaBubbleSkeleton = () => {
  return (
    <Stack width="100%" sx={{ scrollSnapAlign: 'center', mb: 2, mt: 1 }}>
      <ChatBubbleSkeleton />
      <Stack direction="row" alignItems="center" pr={4}>
        <Skeleton variant="circular" width={56} height={56} />
        <Stack maxWidth="100%" overflow="hidden" ml={1} mr="auto">
          <Skeleton variant="text" width={75} />
          <Skeleton variant="text" width={120} />
        </Stack>
        <Skeleton variant="circular" width={18} height={18} />
      </Stack>
    </Stack>
  );
};

export default IdeaBubbleSkeleton;
