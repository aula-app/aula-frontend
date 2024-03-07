import { Stack } from '@mui/material';
import { IdeaBox } from '@/components/IdeaBox';

/** * Renders "IdeasBox" view
 * url: /room/:rommId/ideas-box/:boxId
 */
const IdeasBoxView = () => {
  return (
    <Stack px={1} py={2} sx={{scrollSnapAlign: 'center'}}>
      { 
        <IdeaBox noCategories />
      }
    </Stack>
  );
};

export default IdeasBoxView;
