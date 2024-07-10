import { Fab, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Idea from '@/components/IdeaBubble';
import { databaseRequest } from '@/utils/requests';
import { IdeasResponseType } from '@/types/scopes/IdeaTypes';
import { useAppStore } from '@/store';

/**
 * Renders "WildIdeas" view
 * url: /room/:room_id/ideas
 */

const WildIdeas = () => {
  const params = useParams();
  const [, dispatch] = useAppStore();
  const [ideas, setIdeas] = useState({} as IdeasResponseType);

  const ideasFetch = async () =>
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeasByRoom',
      arguments: { room_id: Number(params['room_id']) },
    }).then((response) => setIdeas(response));

  useEffect(() => {
    ideasFetch();
  }, []);

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
          dispatch({ type: 'EDIT_DATA', payload: { type: 'add', element: 'ideas', id: 0, onClose: ideasFetch } })
        }
      >
        <Add />
      </Fab>
      {ideas.data &&
        ideas.data.map((idea) => (
          <Idea
            idea={idea}
            onReload={ideasFetch}
            key={idea.id}
            comments={idea.sum_comments}
            to={`idea/${idea.id}`}
          />
        ))}
    </Stack>
  );
};

export default WildIdeas;
