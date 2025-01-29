import { IdeaForms } from '@/components/Data/DataForms';
import { ApprovalCard, IdeaBubble, VotingCard } from '@/components/Idea';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import { deleteIdea, editIdea, getIdea } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { Drawer, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { IdeaFormData } from '../WildIdeas/WildIdeasView';
import { navigateTo } from '@/utils';
import CommentView from './Comment';

interface EditFormData extends IdeaFormData {
  idea_id: string;
}

/**
 * Renders "Idea" view
 * url: room/:room_id/.../idea/:idea_id
 */

const IdeaView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { idea_id, room_id, phase } = useParams();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idea, setIdea] = useState<IdeaType>();
  const [edit, setEdit] = useState<EditFormData>(); // undefined = update dialog closed; EditFormData = edit idea;

  // const [comments, setComments] = useState<CommentType[]>([]);
  // const [vote, setVote] = useState<Vote>(0);

  const fetchIdea = useCallback(async () => {
    if (!idea_id) return;
    setLoading(true);
    const response = await getIdea(idea_id);
    if (response.error) setError(response.error);
    if (!response.error && response.data) setIdea(response.data);
    setLoading(false);
  }, [idea_id]);

  useEffect(() => {
    fetchIdea();
  }, [idea_id]);

  const ideaEdit = (idea: IdeaType) => {
    setEdit({
      title: idea.title,
      content: idea.content,
      idea_id: idea.hash_id,
    });
  };

  const ideaUpdate = async (data: IdeaFormData) => {
    if (!edit) return;
    const request = await editIdea({
      idea_id: edit.idea_id,
      ...data,
    });
    if (!request.error) onClose();
  };

  const ideaDelete = async (id: string) => {
    const request = await deleteIdea(id);
    if (request.error) return;
    navigate(`/room/${room_id}${phase ? `/phase/${phase}` : '/'}`);
  };

  // const commentsFetch = async () =>
  //   await databaseRequest({
  //     model: 'Comment',
  //     method: 'getCommentsByIdeaId',
  //     arguments: { idea_id: Number(idea_id) },
  //   }).then((response) => {
  //     if (!response.success || !response.data) return;
  //     setComments(response.data as CommentType[]);
  //   });

  // const getPhase = async () =>
  //   await databaseRequest({
  //     model: 'Topic',
  //     method: 'getTopicBaseData',
  //     arguments: { topic_id: Number(params['box_id']) },
  //   }).then((response) => {
  //     if (!response.success || !response.data) return;
  //     setPhase(Number(response.phase_id || params.phase) as RoomPhases);
  //   });

  // const getVote = async () =>
  //   await databaseRequest(
  //     {
  //       model: 'Idea',
  //       method: 'getVoteValue',
  //       arguments: {
  //         idea_id: params['idea_id'],
  //       },
  //     },
  //     ['user_id']
  //   ).then((response) => {
  //     if (!response.success || !response.data) return;
  //     setVote((Number(response) + 1) as Vote);
  //   });

  // const closeAdd = () => {
  //   commentsFetch();
  //   setAdd(false);
  // };

  // useEffect(() => {
  //   ideaFetch();
  //   commentsFetch();
  //   getVote();
  //   if (params['box_id']) getPhase();
  // }, []);

  const onClose = () => {
    setEdit(undefined);
    fetchIdea();
  };

  return !isLoading && idea ? (
    <Stack width="100%" height="100%" overflow="auto" gap={2}>
      {/* <Stack px={0.5}>
        <VotingQuorum
          phase={phase}
          votes={phase >= 30 ? Number(idea.number_of_votes) : Number(idea.sum_likes)}
          users={Number(idea.number_of_users)}
        />
      </Stack>
      {phase === 40 && <VotingResults yourVote={vote} rejected={idea.is_winner !== 1} />*/}
      {phase === '20' && <ApprovalCard idea={idea} disabled={Number(phase) > 20} />}
      {phase === '30' && <VotingCard onReload={fetchIdea} />}
      <IdeaBubble
        idea={idea}
        onEdit={() => ideaEdit(idea)}
        onDelete={() => ideaDelete(idea.hash_id)}
        disabled={Number(phase) >= 20}
      />
      <Stack px={2}>
        <CommentView />
        {/*}
      {comments && (
        <>
          <Typography variant="h5" py={2}>
            <KnowMore title={t('tooltips.comment')}>
              <Typography>
                {String(comments.length)} {t('scopes.comments.plural')}
              </Typography>
            </KnowMore>
          </Typography>
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} onReload={commentsFetch} disabled={phase > 10} />
          ))}
        </>
      )}
      {phase < 20 && checkPermissions(20) && (
        <Stack alignItems="center">
          <Fab
            aria-label="add"
            color="primary"
            onClick={() => setAdd(true)}
            sx={{
              position: 'fixed',
              bottom: 0,
              boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2)',
              m: 2,
            }}
          >
            <Add />
          </Fab>
        </Stack>
      )}
      <EditData scope="comments" isOpen={add} onClose={closeAdd} otherData={{ idea_id: params.idea_id }} /> */}
      </Stack>
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <IdeaForms onClose={onClose} onSubmit={ideaUpdate} defaultValues={edit} />
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
