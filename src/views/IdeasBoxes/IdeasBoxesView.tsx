import { Grid } from '@mui/material';
import { IdeaBox } from '@/components/IdeaBox';
import { BoxType } from '@/types/BoxTypes';

interface BoxesProps {
  boxes: BoxType[];
}

/** * Renders "IdeasBox" view
 * url: /room/:room_id/
 */
const IdeasBoxView = ({ boxes }: BoxesProps) => {
  return (
    <Grid container spacing={2}>
      {boxes.map((box) => (
        <Grid key={box.id} item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ scrollSnapAlign: 'center' }}>
          <IdeaBox box={box} />
        </Grid>
      ))}
    </Grid>
  );
};

export default IdeasBoxView;
