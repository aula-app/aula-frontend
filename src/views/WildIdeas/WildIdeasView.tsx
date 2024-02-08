import { Stack} from '@mui/material';
import { WildIdea } from '@/components/WildIdea';

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
      {data.map((d, key) => (
        <WildIdea username={d.displayname} text={d.content} date={d.created} key={key} />
      ))}
    </Stack>
  );
};

export default WildIdeas;
