import { Fab, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Idea from '@/components/IdeaBubble';
import { databaseRequest } from '@/utils';
import { IdeasResponseType } from '@/types/scopes/IdeaTypes';
import AlterData from '@/components/AlterData';

/**
 * Renders "WildIdeas" view
 * url: /room/:room_id/ideas
 */

const WildIdeas = () => {
  const params = useParams();
  const [ideas, setIdeas] = useState<IdeasResponseType>();
  const [add, setAdd] = useState(false);

  const ideasFetch = async () =>
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeasByRoom',
      arguments: { room_id: Number(params['room_id']) },
    }).then((response) => setIdeas(response));

  const closeAdd = () => {
    ideasFetch();
    setAdd(false);
  };

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
        onClick={() => setAdd(true)}
      >
        <Add />
      </Fab>
      {ideas &&
        ideas.data &&
        ideas.data.map((idea) => (
          <Idea idea={idea} onReload={ideasFetch} key={idea.id} comments={idea.sum_comments} to={`idea/${idea.id}`} />
        ))}
      <AlterData scope="ideas" isOpen={add} onClose={closeAdd} otherData={{ room_id: params.room_id }} />
    </Stack>
  );
};

export default WildIdeas;
