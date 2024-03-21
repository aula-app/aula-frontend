import { Drawer, Fab, Stack } from '@mui/material';
import { Idea } from '@/components/Idea';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import NewWildIdea from '@/components/NewWildIdea';
import { AppLink } from '@/components';
import { IdeaType } from '@/types/IdeaTypes';

interface WildIdeasProps {
  ideas: IdeaType[];
  reload: () => void;
}

/**
 * Renders "WildIdeas" view
 * url: /room/:room_id
 */
const WildIdeas = ({ ideas, reload }: WildIdeasProps) => {
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
        }}
        onClick={toggleDrawer(true)}
      >
        <Add />
      </Fab>
      <NewWildIdea isOpen={open} closeMethod={closeDrawer} />
      {ideas.map((idea) => (
        <AppLink to={`idea/${idea.id}`} key={idea.id} width="100%">
          <Idea idea={idea} />
        </AppLink>
      ))}
    </Stack>
  );
};

export default WildIdeas;
