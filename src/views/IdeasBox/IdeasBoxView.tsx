import { Stack, Typography } from '@mui/material';
import { IdeaBox } from '@/components/IdeaBox';
import { IdeaCards } from '@/components/IdeaCards';

/** * Renders "IdeasBox" view
 * url: /room/:roomId/ideas-box/:boxId
 */
const IdeasBoxView = () => {
  return (
    <Stack px={1} py={2} sx={{scrollSnapAlign: 'center'}}>
      <IdeaBox noCategories />
      <Stack>
        <Typography variant='h6' p={2}>X ideas</Typography>
        <IdeaCards />
        <IdeaCards variant="approved" />
        <IdeaCards variant="dismissed" />
        <IdeaCards variant="voting" />
        <IdeaCards variant="voted" />
        <IdeaCards variant="rejected" />
      </Stack>
    </Stack>
  );
};

export default IdeasBoxView;
