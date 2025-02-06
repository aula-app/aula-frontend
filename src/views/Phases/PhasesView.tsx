import { Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import DashBoard from '../Welcome/DashBoard';
import BoxIdeasPhaseView from './BoxIdeasPhaseView';
import WildIdeaPhaseView from './WildIdeaPhaseView';

/**
 * Renders "Phase" view
 * url: /Phase/:phase
 */

const PhasesView = () => {
  const { phase } = useParams();
  return (
    <Stack>
      <DashBoard show={true} />
      {phase === '0' ? <WildIdeaPhaseView /> : <BoxIdeasPhaseView />}
    </Stack>
  );
};

export default PhasesView;
