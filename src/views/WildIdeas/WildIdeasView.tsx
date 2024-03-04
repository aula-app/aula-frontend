import { Drawer, Fab, Stack } from '@mui/material';
import { WildIdea } from '@/components/WildIdea';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import NewWildIdea from '@/components/NewWildIdea';

interface WildIdeasProps {
  data: any[];
  reload: () => void;
}

/**
 * Renders "WildIdeas" view
 * url: /
 */
const WildIdeas = ({ data, reload }: WildIdeasProps) => {
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
        <AddIcon />
      </Fab>
      <Drawer anchor="bottom" open={open} onClose={toggleDrawer(false)}>
        <NewWildIdea closeMethod={closeDrawer} />
      </Drawer>
      {data.map((d, key) => (
        <WildIdea username={d.displayname} text={d.content} date={d.created} key={key} />
      ))}
    </Stack>
  );
};

export default WildIdeas;
