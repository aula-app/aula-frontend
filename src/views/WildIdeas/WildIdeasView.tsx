import { Fab, Stack} from '@mui/material';
import { WildIdea } from '@/components/WildIdea';
import AddIcon from '@mui/icons-material/Add';

interface WildIdeasProps {
  data: any[]
}

/**
 * Renders "WildIdeas" view
 * url: /
 */
const WildIdeas = ({data}: WildIdeasProps) => {
  return (
    <Stack>
      <Fab
        color="primary"
        sx={{
          position: 'absolute',
          bottom: 80,
          right: 16,
        }}
        aria-label="add">
        <AddIcon />
      </Fab>
      {data.map((d, key) => (
        <WildIdea username={d.displayname} text={d.content} date={d.created} key={key} />
      ))}
    </Stack>
  );
};

export default WildIdeas;
