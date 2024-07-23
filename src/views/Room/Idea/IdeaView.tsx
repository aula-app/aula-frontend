import AlterData from '@/components/AlterData';
import ApprovalCard from '@/components/ApprovalCard';
import Comment from '@/components/Comment';
import IdeaBubble from '@/components/IdeaBubble';
import IdeaDocument from '@/components/IdeaDocument';
import VotingCard from '@/components/VotingCard';
import VotingResults from '@/components/VotingResults';
import { CommentsResponseType, SingleIdeaResponseType } from '@/types/RequestTypes';
import { Vote, databaseRequest, localStorageGet, parseJwt } from '@/utils';
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
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const params = useParams();
  const [idea, setIdea] = useState<SingleIdeaResponseType>();
  const [add, setAdd] = useState(false);
  const [phase, setPhase] = useState(0);
  const [comments, setComments] = useState<CommentsResponseType>();
  const [vote, setVote] = useState<Vote>(0);

  const ideaFetch = async () =>
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeaContent',
      arguments: { idea_id: params['idea_id'] },
    }).then((response) => {
      setIdea(response);
    });

  const commentsFetch = async () =>
    await databaseRequest({
      model: 'Comment',
      method: 'getCommentsByIdeaId',
      arguments: { idea_id: Number(params['idea_id']) },
    }).then((response) => setComments(response));

  const getPhase = async () =>
    await databaseRequest({
      model: 'Topic',
      method: 'getTopicBaseData',
      arguments: { topic_id: Number(params['box_id']) },
    }).then((response) => setPhase(Number(response.data.phase_id)));

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
    ).then((response) => setVote((Number(response.data) + 1) as Vote));

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

  return (
    <Stack width="100%" height="100%" overflow="auto">
      {phase === 30 && <VotingCard />}
      {idea && idea.data && (
        <Stack p={2}>
          {phase === 40 && <VotingResults yourVote={vote} rejected={idea.data.is_winner !== 1} />}
          {phase === 0 ? (
            <IdeaBubble idea={idea.data} onReload={ideaFetch} />
          ) : (
            <IdeaDocument idea={idea.data} onReload={ideaFetch} disabled={phase > 10} />
          )}
          {phase >= 20 && idea.data.approved !== 0 && (
            <ApprovalCard
              comment={idea.data.approval_comment}
              rejected={idea.data.approved < 0}
              disabled={phase > 20}
            />
          )}
          {comments && comments.data && (
            <>
              <Typography variant="h5" py={2}>
                {String(comments.count)} {t('views.comments')}
              </Typography>
              {comments.data.map((comment) => (
                <Comment key={comment.id} comment={comment} onReload={commentsFetch} disabled={phase > 10} />
              ))}
            </>
          )}
          {phase < 20 && jwt_payload.user_level >= 20 && (
            <Stack alignItems="center">
              <Fab
                aria-label="add"
                color="primary"
                onClick={() => setAdd(true)}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2)',
                  m: 2,
                }}
              >
                <Add />
              </Fab>
            </Stack>
          )}
          <AlterData scope="comments" isOpen={add} onClose={closeAdd} otherData={{ idea_id: params.idea_id }} />
        </Stack>
      )}
    </Stack>
  );
};

export default IdeaView;
