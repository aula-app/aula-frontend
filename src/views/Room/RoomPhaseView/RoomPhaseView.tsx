import { useParams } from 'react-router-dom';
import { PhaseType } from '@/types/SettingsTypes';
import { phases } from '@/utils/phases';
import BoxPhaseView from '@/views/BoxPhase';
import WildIdeasView from '@/views/WildIdeas';

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
  const currentPhase = phase as `${keyof typeof phases}`;

  if (!phase || !phases[currentPhase]) {
    return null;
  }

  const activePhase = phases[currentPhase] as PhaseType;
  return activePhase === 'wild' ? <WildIdeasView /> : <BoxPhaseView />;
};

export default RoomPhaseView;
