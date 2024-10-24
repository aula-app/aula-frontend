import { useParams } from 'react-router-dom';
import IdeasBoxesView from './IdeasBoxes';
import WildIdeasView from './WildIdeas';

/**
 * Renders "Room" view
 * url: /room/:room_id/:phase
 */
const RoomView = () => {
  const params = useParams();
  return params['phase'] ? Number(params['phase']) === 0 ? <WildIdeasView /> : <IdeasBoxesView /> : null;
};

export default RoomView;
