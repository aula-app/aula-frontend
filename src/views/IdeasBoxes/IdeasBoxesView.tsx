import { Grid } from '@mui/material';
import { IdeaBox } from '@/components/IdeaBox';
import { BoxType } from '@/types/scopes/BoxTypes';

interface BoxesProps {
  boxes: BoxType[];
  onReload: () => void;
}

/** * Renders "IdeasBox" view
 * url: /room/:room_id/
 */
const IdeasBoxView = ({ boxes, onReload }: BoxesProps) => {
  return (
    <Grid container spacing={2}>
      {boxes.map((box) => (
        <Grid key={box.id} item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ scrollSnapAlign: 'center' }}>
          <IdeaBox box={box} onReload={onReload}/>
        </Grid>
      ))}
    </Grid>
  );
};

export default IdeasBoxView;
