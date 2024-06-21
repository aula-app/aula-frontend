import { Fab, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import ApprovalCard from '@/components/ApprovalCard';
import VotingCard from '@/components/VotingCard';
import VotingResults from '@/components/VotingResults';
import { databaseRequest } from '@/utils/requests';
import { CommentResponseType } from '@/types/CommentTypes';
import { SingleIdeaResponseType } from '@/types/IdeaTypes';
import NewComment from '@/components/NewComment';
import { Add } from '@mui/icons-material';
import { BoxResponseType } from '@/types/BoxTypes';
import IdeaBubble from '@/components/IdeaBubble';
import Comment from '@/components/Comment';
import IdeaDocument from '@/components/IdeaDocument';

/**
 * Renders "Idea" view
 * url: room/:room_id/.../idea/:idea_id
 */

const IdeaView = () => {
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [idea, setIdea] = useState({} as SingleIdeaResponseType);
  const [phase, setPhase] = useState(0);
  const [comments, setComments] = useState({} as CommentResponseType);

  let displayDate!: Date;

  const ideaFetch = async () =>
    await databaseRequest('model', {
      model: 'Idea',
      method: 'getIdeaContent',
      arguments: { idea_id: params['idea_id'] },
    }).then((response: SingleIdeaResponseType) => {
      setIdea(response);
      displayDate = new Date(response.data.created);
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
    }).then((response: BoxResponseType) => setPhase(response.data.phase_id));

  useEffect(() => {
    ideaFetch();
    commentsFetch();
    if (params['box_id']) getPhase();
  }, []);

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);
  const closeDrawer = () => {
    setOpen(false);
    commentsFetch();
  };

  return (
    <Stack width="100%" height="100%" overflow="auto">
      {phase === 2 && <VotingCard />}
      {idea.data && (
        <Stack p={2}>
          {phase === 3 && <VotingResults yourVote={0} />}
          {phase === 0 ? (
            <IdeaBubble idea={idea.data} onReload={ideaFetch} />
          ) : (
            <IdeaDocument idea={idea.data} onReload={ideaFetch} />
          )}
          {idea.data && idea.data.approved != 0 && phase > 0 && (
            <ApprovalCard comment={idea.data.approval_comment} rejected={idea.data.approved < 0} disabled={phase > 1} />
          )}
          <Typography variant="h5" py={2}>
            {String(comments.count)} Comments
          </Typography>
          {comments.data &&
            comments.data.map((comment) => <Comment key={comment.id} comment={comment} onReload={commentsFetch} />)}
          {phase < 2 && (
            <Stack alignItems="center">
              <Fab
                aria-label="add"
                color="primary"
                onClick={toggleDrawer(true)}
                sx={{
                  position: 'absolute',
                  right: 0,
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
