import { Stack, Typography } from '@mui/material';
import { IdeaBox } from '@/views/IdeaBoxes';
import { IdeaCards } from '@/components/IdeaCards';

/** * Renders "IdeasBox" view
 * url: /room/:rommId/ideas-box/:boxId
 */
const IdeasBoxView = () => {
  return (
    <Stack px={1} py={2} sx={{scrollSnapAlign: 'center'}}>
      <IdeaBox noCategories />
      <Stack>
        <Typography variant='h6' p={2}>X ideas</Typography>
        <IdeaCards />
      </Stack>
    </Stack>
  );
};

export default IdeasBoxView;
