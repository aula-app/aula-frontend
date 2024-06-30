import { Fab, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import ApprovalCard from '@/components/ApprovalCard';
import VotingCard from '@/components/VotingCard';
import VotingResults from '@/components/VotingResults';
import { Vote, databaseRequest, localStorageGet, parseJwt, phases } from '@/utils';
import { CommentResponseType } from '@/types/scopes/CommentTypes';
import { SingleIdeaResponseType } from '@/types/scopes/IdeaTypes';
import NewComment from '@/components/NewComment';
import { Add } from '@mui/icons-material';
import { BoxResponseType } from '@/types/scopes/BoxTypes';
import IdeaBubble from '@/components/IdeaBubble';
import Comment from '@/components/Comment';
import IdeaDocument from '@/components/IdeaDocument';
import { RoomPhases } from '@/types/scopes/RoomTypes';
import { AppIcon } from '@/components';

/**
 * Renders "Idea" view
 * url: room/:room_id/.../idea/:idea_id
 */

const IdeaView = () => {
  const params = useParams();
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const [open, setOpen] = useState(false);
  const [idea, setIdea] = useState({} as SingleIdeaResponseType);
  const [phase, setPhase] = useState(0);
  const [comments, setComments] = useState({} as CommentResponseType);
  const [vote, setVote] = useState<Vote>(0);

  const ideaFetch = async () =>
    await databaseRequest('model', {
      model: 'Idea',
      method: 'getIdeaContent',
      arguments: { idea_id: params['idea_id'] },
    }).then((response: SingleIdeaResponseType) => {
      setIdea(response);
    });

  const commentsFetch = async () =>
    await databaseRequest('model', {
      model: 'Comment',
      method: 'getCommentsByIdeaId',
      arguments: { idea_id: Number(params['idea_id']) },
    }).then((response: CommentResponseType) => setComments(response));

  const getPhase = async () =>
    databaseRequest('model', {
      model: 'Topic',
      method: 'getTopicBaseData',
      arguments: { topic_id: Number(params['box_id']) },
    }).then((response: BoxResponseType) => setPhase(Number(response.data.phase_id)));

  const getVote = async () =>
    await databaseRequest('model', {
      model: 'Idea',
      method: 'getVoteValue',
      arguments: {
        user_id: jwt_payload.user_id,
        idea_id: Number(params['idea_id']),
      },
    }).then((response) => setVote((Number(response.data) + 1) as Vote));

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);
  const closeDrawer = () => {
    setOpen(false);
    commentsFetch();
  };

  useEffect(() => {
    ideaFetch();
    commentsFetch();
    getVote();
    if (params['box_id']) getPhase();
  }, []);

  return (
    <Stack width="100%" height="100%" overflow="auto">
      <Stack direction="row" pt={2} px={1}>
        {Object.keys(phases).map(p => {
          const currentPhase = p as RoomPhases;
          return (
          <Stack
            flex={phase === Number(currentPhase) ? 1 : 0}
            direction="row"
            sx={{
              aspectRatio: phase === Number(currentPhase) ? '' : 1,
              borderRadius: 999,
            }}
            bgcolor={phases[currentPhase].color}
            key={currentPhase}
            alignItems="center"
            p={1}
            mx={.5}
          >
            <AppIcon icon={phases[currentPhase].icon} />
             {phase === Number(currentPhase) &&
              <Typography ml={1}>{phases[currentPhase].name}</Typography>
             }
          </Stack>
        )})}
      </Stack>
      {phase === 30 && <VotingCard />}
      {idea.data && (
        <Stack p={2}>
          {phase === 40 && <VotingResults yourVote={vote} />}
          {phase === 0 ? (
            <IdeaBubble idea={idea.data} onReload={ideaFetch} />
          ) : (
            <IdeaDocument idea={idea.data} onReload={ideaFetch} disabled={phase > 10} />
          )}
          {idea.data && phase >= 20 && (
            <ApprovalCard
              comment={idea.data.approval_comment}
              rejected={idea.data.approved < 0}
              disabled={phase > 20}
            />
          )}
          <Typography variant="h5" py={2}>
            {String(comments.count)} Comments
          </Typography>
          {comments.data &&
            comments.data.map((comment) => (
              <Comment key={comment.id} comment={comment} onReload={commentsFetch} disabled={phase > 10} />
            ))}
          {phase < 20 && (
            <Stack alignItems="center">
              <Fab
                aria-label="add"
                color="primary"
                onClick={toggleDrawer(true)}
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
          <NewComment isOpen={open} closeMethod={closeDrawer} />
        </Stack>
      )}
    </Stack>
  );
};

export default IdeaView;
