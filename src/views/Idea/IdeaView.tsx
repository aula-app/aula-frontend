import { AddCategoryRefProps } from '@/components/Buttons/AddCategories/AddCategoriesButton';
import { IdeaForms } from '@/components/DataForms';
import { ApprovalCard, IdeaBubble, VotingCard, VotingResults } from '@/components/Idea';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import VotingQuorum from '@/components/Idea/VotingQuorum';
import { deleteIdea, getIdea } from '@/services/ideas';
import { useAppStore } from '@/store/AppStore';
import { getRoom } from '@/services/rooms';
import { getIdeaBoxes } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { Drawer, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import CommentView from './Comment';

/**
 * Renders "Idea" view
 * url: room/:room_id/.../idea/:idea_id
 */

const IdeaView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { idea_id, room_id, phase } = useParams();

  const addCategory = useRef<AddCategoryRefProps>(null);
  const [appState, dispatch] = useAppStore();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idea, setIdea] = useState<IdeaType>();
  const [edit, setEdit] = useState<IdeaType>(); // undefined = update dialog closed; EditFormData = edit idea;

  // const [comments, setComments] = useState<CommentType[]>([]);
  // const [vote, setVote] = useState<Vote>(0);

  const getRoomName = (id: string) => {
    return getRoom(id).then((response) => {
      if (response.error || !response.data) return;
      let roomName = response.data.room_name;
      return roomName;
    });
  };

  const getIdeaBox = (idea_id: string) => {
    return getIdeaBoxes(idea_id).then((response) => {
      if (response.error || !response.data) return;
      return response.data[0];
    });
  }

  const fetchIdea = useCallback(async () => {
    if (!idea_id) return;
    setLoading(true);
    const response = await getIdea(idea_id);

    let roomName = 'aula';
    if (room_id) {
      let nameResponse = await getRoomName(room_id);
      if (nameResponse) roomName = nameResponse;
    }

    const topic = await getIdeaBox(idea_id);

    let topicName = '';
    let topicId = '';
    if (topic) {
      if (topic.name)
        topicName = topic.name;

      if (topic.hash_id)
        topicId = topic.hash_id;
    }

    if (response.data && response.data.title) {
      let breadCrumbs = [
            [roomName, `/room/${room_id}/phase/0`],
            [t(`phases.name-${phase}`), `/room/${room_id}/phase/${phase}`],
      ]
 
      if (phase && phase != "0") {
        // Add Topic Name to breadcrumb
        breadCrumbs.push([topicName, `/room/${room_id}/phase/${phase}/idea-box/${topicId}`])
      }

      // Add Idea Title to breadcrumb
      breadCrumbs.push([response.data.title, ''])
      dispatch({
        action: 'SET_BREADCRUMB',
        breadcrumb: breadCrumbs 
      });
      
    } 

    if (response.error) setError(response.error);
    if (!response.error && response.data) setIdea(response.data);
    setLoading(false);
  }, [idea_id]);

  useEffect(() => {
    fetchIdea();
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
      {(!!phase && Number(phase) === 30) && <VotingCard onReload={fetchIdea} />}
      {(!!phase && (Number(phase) === 20 || Number(phase) === 40)) && <VotingResults phase={Number(phase)} idea={idea} onReload={fetchIdea} />}
      <IdeaBubble
        idea={idea}
        onEdit={() => setEdit(idea)}
        onDelete={() => ideaDelete(idea.hash_id)}
        disabled={Number(phase) >= 20}
      >

        <VotingQuorum
          phase={Number(phase) as RoomPhases}
          votes={Number(phase) >= 30 ? Number(idea.sum_votes) : Number(idea.sum_likes)}
          users={Number(idea.number_of_users)}
        />
      </IdeaBubble>
      {(phase == "40"  || phase == "20") && (
        <ApprovalCard idea={idea} phase={Number(phase)} disabled={Number(phase) > 20} onReload={fetchIdea} />
      )}
      <Stack px={2}>
        <CommentView />
      </Stack>
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <IdeaForms onClose={onClose} defaultValues={edit} />
      </Drawer>
    </Stack>
  ) : (
    <Stack width="100%" height="100%" overflow="auto">
      {isLoading && <IdeaBubbleSkeleton />}
      {error && <Typography>{t(error)}</Typography>}
    </Stack>
  );
};

export default IdeaView;
