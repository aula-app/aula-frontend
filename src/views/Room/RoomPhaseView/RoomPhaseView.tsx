import { useParams } from 'react-router-dom';
import WildIdeasView from '../WildIdeas';
import IdeasBoxesView from '../IdeasBoxes';

/**
 * Renders "Room" view
 * url: /room/:room_id/:phase
 */
const RoomView = () => {
  const params = useParams();
  return params['phase']
    ? Number(params['phase']) === 0
      ? <WildIdeasView />
      : <IdeasBoxesView />
    : null
};

export default RoomView;
