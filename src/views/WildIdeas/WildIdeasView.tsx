import { Fab, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import NewWildIdea from '@/components/NewWildIdea';
import { AppLink } from '@/components';
import { IdeaType } from '@/types/IdeaTypes';
import { useParams } from 'react-router-dom';
import Idea from '@/components/IdeaBubble';

interface WildIdeasProps {
  ideas: IdeaType[];
  reload: () => void;
}

/**
 * Renders "WildIdeas" view
 * url: /room/:room_id
 */
const WildIdeas = ({ ideas, reload }: WildIdeasProps) => {
  const params = useParams();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);
  const closeDrawer = () => {
    setOpen(false);
    reload();
  };

  return (
    <Stack alignItems="center" width="100%" px={1}>
      <Fab
        aria-label="add"
        color="primary"
        sx={{
          position: 'absolute',
          bottom: 40,
          boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2)',
        }}
        onClick={toggleDrawer(true)}
      >
        <Add />
      </Fab>
      <NewWildIdea isOpen={open} closeMethod={closeDrawer} />
      {ideas.map((idea) => (
        <AppLink to={`/room/${params['room_id']}/idea/${idea.id}`} width="100%">
          <Idea idea={idea} onReload={reload} key={idea.id} />
        </AppLink>
      ))}
    </Stack>
  );
};

export default WildIdeas;
