import { Fab, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import { IdeaType } from '@/types/scopes/IdeaTypes';
import { useParams } from 'react-router-dom';
import Idea from '@/components/IdeaBubble';
import { useAppStore } from '@/store';

interface WildIdeasProps {
  ideas: IdeaType[];
  onReload: () => void;
}

/**
 * Renders "WildIdeas" view
 * url: /room/:room_id/ideas
 */
const WildIdeas = ({ ideas, onReload }: WildIdeasProps) => {
  const params = useParams();
  const [state, dispatch] = useAppStore();

  return (
    <Stack alignItems="center" width="100%" px={1}>
      <Fab
        aria-label="add"
        color="primary"
        sx={{
          position: 'absolute',
          bottom: 40,
        }}
        onClick={() =>
          dispatch({ type: 'EDIT_DATA', payload: { type: 'add', element: 'ideas', id: 0, onClose: onReload } })
        }
      >
        <Add />
      </Fab>
      {ideas.map((idea) => (
        <Idea
          idea={idea} onReload={onReload}
          key={idea.id}
          comments={idea.sum_comments}
          to={`/room/${params['room_id']}/idea/${idea.id}`}
          />
      ))}
    </Stack>
  );
};

export default WildIdeas;
