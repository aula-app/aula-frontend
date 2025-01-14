import { useParams } from 'react-router-dom';
import { PhaseType } from '@/types/SettingsTypes';
import { phases } from '@/utils/phases';
import IdeasBoxesView from './IdeasBoxes';
import WildIdeasView from './WildIdeas';

/**
 * Renders the appropriate view based on the room phase
 * @route /room/:room_id/:phase
 *
 * Phase values:
 * - 0: Wild Ideas - Initial idea submission phase
 * - 10: Discussion - Ideas are discussed and refined
 * - 20: Approval - Ideas are approved or rejected
 * - 30: Voting - Participants vote on approved ideas
 * - 40: Results - Final results are displayed
 */
const RoomPhaseView = () => {
  const { phase } = useParams();

  if (!phase || !phases[phase]) {
    return null;
  }

  const currentPhase = phases[phase] as PhaseType;
  return currentPhase === 'wild' ? <WildIdeasView /> : <IdeasBoxesView />;
};

export default RoomPhaseView;
