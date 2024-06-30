import { Fab, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import NewWildIdea from '@/components/NewWildIdea';
import { IdeaType } from '@/types/scopes/IdeaTypes';
import { useParams } from 'react-router-dom';
import Idea from '@/components/IdeaBubble';

interface WildIdeasProps {
  ideas: IdeaType[];
  onReload: () => void;
}

/**
 * Renders "WildIdeas" view
 * url: /room/:room_id
 */
const WildIdeas = ({ ideas, onReload }: WildIdeasProps) => {
  const params = useParams();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);
  const closeDrawer = () => {
    setOpen(false);
    onReload();
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
        <Idea
          idea={idea} ononReload={onReload}
          key={idea.id}
          comments={idea.sum_comments}
          to={`/room/${params['room_id']}/idea/${idea.id}`}
          />
      ))}
    </Stack>
  );
};

export default WildIdeas;
