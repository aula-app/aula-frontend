import { Fab, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import NewWildIdea from '@/components/NewWildIdea';
import { AppLink } from '@/components';
import { IdeasResponseType } from '@/types/IdeaTypes';
import { useParams } from 'react-router-dom';
import Idea from '@/components/IdeaBubble';
import { databaseRequest } from '@/utils/requests';

/**
 * Renders "WildIdeas" view
 * url: /room/:room_id/ideas
 */

const WildIdeas = () => {
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [ideas, setIdeas] = useState({} as IdeasResponseType);

  const ideasFetch = async () =>
    await databaseRequest('model', {
      model: 'Idea',
      method: 'getIdeasByRoom',
      arguments: { room_id: Number(params['room_id']) },
      decrypt: ['displayname', 'content'],
  }).then((response) => setIdeas(response));

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);
  const closeDrawer = () => {
    setOpen(false);
    ideasFetch();
  };

  useEffect(() => {
    ideasFetch();
  }, [])

  return (
    <Stack alignItems="center" width="100%" px={1}>
      <Fab
        aria-label="add"
        color="primary"
        sx={{
          position: 'absolute',
          bottom: 40,
        }}
        onClick={toggleDrawer(true)}
      >
        <Add />
      </Fab>
      <NewWildIdea isOpen={open} closeMethod={closeDrawer} />
      {ideas.data && ideas.data.map((idea) => (
        <AppLink to={`/room/${params['room_id']}/idea/${idea.id}`} width="100%" key={idea.id}>
          <Idea idea={idea} onReload={ideasFetch} key={idea.id}  />
        </AppLink>
      ))}
    </Stack>
  );
};

export default WildIdeas;
