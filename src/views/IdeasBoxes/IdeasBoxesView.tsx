import { Grid } from '@mui/material';
import { IdeaBox } from '@/components/IdeaBox';
import { BoxType } from '@/types/BoxTypes';
import { AppLink } from '@/components';
import { useParams } from 'react-router-dom';

interface BoxesProps {
  boxes: BoxType[];
}

/** * Renders "IdeasBox" view
 * url: /room/:room_id/
 */
const IdeasBoxView = ({ boxes }: BoxesProps) => {
  const params = useParams();
  return (
    <Grid container spacing={2}>
      {boxes.map((box) => (
        <Grid key={box.id} item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ scrollSnapAlign: 'center' }}>
          <AppLink to={`/room/${params.room_id}/idea-box/${box.id}`} mb={2} key={box.id}>
            <IdeaBox box={box} />
          </AppLink>
        </Grid>
      ))}
    </Grid>
  );
};

export default IdeasBoxView;
