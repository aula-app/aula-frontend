import EditData from '@/components/Data/EditData';
import { ApprovalCard, Comment, IdeaBubble, IdeaDocument, VotingCard, VotingResults } from '@/components/Idea';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import VotingQuorum from '@/components/Idea/VotingQuorum';
import KnowMore from '@/components/KnowMore';
import { CommentType, IdeaType } from '@/types/Scopes';
import { Vote, checkPermissions, databaseRequest } from '@/utils';
import { Add } from '@mui/icons-material';
import { Fab, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

/**
 * Renders "Idea" view
 * url: room/:room_id/.../idea/:idea_id
 */

const IdeaView = () => {
  const { t } = useTranslation();
  const params = useParams();

  const [idea, setIdea] = useState<IdeaType>();
  const [add, setAdd] = useState(false);
  const [phase, setPhase] = useState(Number(params.phase) || 0);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [vote, setVote] = useState<Vote>(0);

  const ideaFetch = async () =>
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeaBaseData',
      arguments: { idea_id: params['idea_id'] },
    }).then((response) => {
      if (!response.success || !response.data) return;
      setIdea(response.data as IdeaType);
    });

  const commentsFetch = async () =>
    await databaseRequest({
      model: 'Comment',
      method: 'getCommentsByIdeaId',
      arguments: { idea_id: Number(params['idea_id']) },
    }).then((response) => {
      if (!response.success || !response.data) return;
      setComments(response.data as CommentType[]);
    });

  const getPhase = async () =>
    await databaseRequest({
      model: 'Topic',
      method: 'getTopicBaseData',
      arguments: { topic_id: Number(params['box_id']) },
    }).then((response) => {
      if (!response.success || !response.data) return;
      setPhase(Number(response.phase_id) || Number(params.phase));
    });

  const getVote = async () =>
    await databaseRequest(
      {
        model: 'Idea',
        method: 'getVoteValue',
        arguments: {
          idea_id: Number(params['idea_id']),
        },
      },
      ['user_id']
    ).then((response) => {
      if (!response.success || !response.data) return;
      setVote((Number(response) + 1) as Vote);
    });

  const closeAdd = () => {
    commentsFetch();
    setAdd(false);
  };

  useEffect(() => {
    ideaFetch();
    commentsFetch();
    getVote();
    if (params['box_id']) getPhase();
  }, []);

  return idea ? (
    <Stack width="100%" height="100%" overflow="auto" p={2}>
      {phase === 40 && <VotingResults yourVote={vote} rejected={idea.is_winner !== 1} />}
      {phase === 30 && (
        <>
          <VotingQuorum votes={Number(idea.number_of_votes)} users={Number(idea.number_of_users)} />
          <VotingCard />
        </>
      )}
      {phase === 0 ? (
        <IdeaBubble idea={idea} onReload={ideaFetch} />
      ) : (
        <IdeaDocument idea={idea} onReload={ideaFetch} disabled={phase > 10} />
      )}
      {phase >= 20 && idea.approved !== 0 && (
        <ApprovalCard
          comment={idea.approval_comment ? idea.approval_comment : ''}
          rejected={idea.approved < 0}
          disabled={phase > 20}
        />
      )}
      {comments && (
        <>
          <Typography variant="h5" py={2}>
            <KnowMore title={t('tooltips.comment')}>
              <Typography>
                {String(comments.length)} {t('views.comments')}
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
      <EditData scope="comments" isOpen={add} onClose={closeAdd} otherData={{ idea_id: params.idea_id }} />
    </Stack>
  ) : (
    <Stack width="100%" height="100%" overflow="auto" p={2}>
      <IdeaBubbleSkeleton />
    </Stack>
  );
};

export default IdeaView;
