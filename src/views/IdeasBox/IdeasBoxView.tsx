import { Box, Stack, Typography } from '@mui/material';
import { IdeaBox } from '@/components/IdeaBox';
import { IdeaCards } from '@/components/IdeaCards';

/** * Renders "IdeasBox" view
 * url: /room/:roomId/ideas-box/:boxId
 */
const IdeasBoxView = () => {
  return (
    <Box
      height="100%"
      flexGrow={1}
      position="relative"
      px={1}
      py={2}
      sx={{
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
      }}
    >
        <IdeaBox noCategories />
        <Typography variant="h6" p={2}>
          X ideas
        </Typography>
        <IdeaCards />
        <IdeaCards variant="approved" />
        <IdeaCards variant="dismissed" />
        <IdeaCards variant="voting" />
        <IdeaCards variant="voted" />
        <IdeaCards variant="rejected" />
    </Box>
  );
};

export default IdeasBoxView;
