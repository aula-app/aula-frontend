import { Button, Drawer, Fab, Stack } from '@mui/material';
import { WildIdea } from '@/components/WildIdea';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { TextareaAutosize } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import NewWildIdea from '@/components/NewWildIdea';

interface WildIdeasProps {
  data: any[];
}

/**
 * Renders "WildIdeas" view
 * url: /
 */
const WildIdeas = ({ data }: WildIdeasProps) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
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
        <NewWildIdea />
      </Drawer>
      {data.map((d, key) => (
        <WildIdea username={d.displayname} text={d.content} date={d.created} key={key} />
      ))}
    </Stack>
  );
};

export default WildIdeas;
