import { IdeaForms } from '@/components/DataForms';
import { ApprovalCard, IdeaBubble, VotingCard, VotingResults } from '@/components/Idea';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import VotingQuorum from '@/components/Idea/VotingQuorum';
import { deleteIdea, getIdea, getIdeaBoxes } from '@/services/ideas';
import { getRoom } from '@/services/rooms';
import { useAppStore } from '@/store/AppStore';
import { IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { Drawer, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import CommentView from '../Comment';
import { getQuorum } from '@/services/vote';

/**
 * Renders "Idea" view
 * url: room/:room_id/.../idea/:idea_id
 */

const IdeaView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { idea_id, room_id, phase } = useParams();

  const [appState, dispatch] = useAppStore();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idea, setIdea] = useState<IdeaType>();
  const [edit, setEdit] = useState<IdeaType>(); // undefined = update dialog closed; EditFormData = edit idea;
  const [quorum, setQuorum] = useState<number>(0);

  // const [comments, setComments] = useState<CommentType[]>([]);
  // const [vote, setVote] = useState<Vote>(0);

  const getRoomName = (id: string) => {
    return getRoom(id).then((response) => {
      if (response.error || !response.data) return;
      let roomName = response.data.room_name;
      return roomName;
    });
  };

  const fetchIdea = async () => {
    if (!idea_id) return;
    if (typeof idea === 'undefined') setLoading(true);
    const response = await getIdea(idea_id);

    let roomName = 'aula';
    if (room_id) {
      let nameResponse = await getRoomName(room_id);
      if (nameResponse) roomName = nameResponse;
    }

    const topic = (await getIdeaBoxes(idea_id)).data?.[0];

    let topicName = '';
    let topicId = '';
    if (topic) {
      if (topic.name) topicName = topic.name;

      if (topic.hash_id) topicId = topic.hash_id;
    }

    if (response.data && response.data.title) {
      let breadCrumbs = [
        [roomName, `/room/${room_id}/phase/0`],
        [t(`phases.name-${phase}`), `/room/${room_id}/phase/${phase}`],
      ];

      if (phase && phase != '0') {
        // Add Topic Name to breadcrumb
        breadCrumbs.push([topicName, `/room/${room_id}/phase/${phase}/idea-box/${topicId}`]);
      }

      // Add Idea Title to breadcrumb
      breadCrumbs.push([response.data.title, '']);
      dispatch({
        action: 'SET_BREADCRUMB',
        breadcrumb: breadCrumbs,
      });
    }

    if (response.error) setError(response.error);
    if (!response.error && response.data) setIdea(response.data);
    if (isLoading) setLoading(false);
  };

  async function fetchQuorum() {
    getQuorum().then((response) => {
      if (response.error || !response.data) return;
      setQuorum(Number(phase) >= 30 ? Number(response.data.quorum_votes) : Number(response.data.quorum_wild_ideas));
    });
  }

  useEffect(() => {
    fetchIdea();
    fetchQuorum();
  }, [idea_id]);

  const ideaDelete = async (id: string) => {
    const request = await deleteIdea(id);
    if (request.error) return;
    navigate(`/room/${room_id}${phase ? `/phase/${phase}` : '/'}`);
  };

  const onClose = () => {
    setEdit(undefined);
    fetchIdea();
  };

  return !isLoading && idea ? (
    <Stack width="100%" height="100%" overflow="auto" gap={2}>
      {phase === '30' && idea.approved > 0 && <VotingCard onReload={fetchIdea} />}
      {phase === '40' && <VotingResults idea={idea} onReload={fetchIdea} quorum={quorum} />}
      <IdeaBubble
        idea={idea}
        onEdit={() => setEdit(idea)}
        onDelete={() => ideaDelete(idea.hash_id)}
        disabled={Number(phase) >= 20}
      >
        {idea.approved >= 0 && (
          <VotingQuorum
            quorum={quorum}
            phase={Number(phase) as RoomPhases}
            votes={Number(phase) >= 30 ? Number(idea.number_of_votes) : Number(idea.sum_likes)}
            users={Number(idea.number_of_users)}
          />
        )}
      </IdeaBubble>
      {Number(phase) >= 20 && <ApprovalCard idea={idea} onReload={fetchIdea} />}
      <Stack px={2} flex={1}>
        <CommentView />
      </Stack>
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <IdeaForms onClose={onClose} defaultValues={edit} />
      </Drawer>
    </Stack>
  ) : (
    <Stack width="100%" height="100%" overflow="auto">
      {isLoading && <IdeaBubbleSkeleton />}
    </Stack>
  );
};

export default IdeaView;
