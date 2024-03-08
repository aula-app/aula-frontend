import { Stack } from '@mui/material';
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
    <Stack px={1} py={2} sx={{ scrollSnapAlign: 'center' }}>
      {boxes.map((box) => (
        <AppLink to={`/room/${params.room_id}/idea-box/${box.id}`} mb={2}>
          <IdeaBox box={box} key={box.id} />
        </AppLink>
      ))}
    </Stack>
  );
};

export default IdeasBoxView;
