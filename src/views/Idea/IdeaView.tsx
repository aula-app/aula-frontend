import { Fab, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import Idea from '@/components/Idea';
import IdeaComment from '@/components/IdeaComment';
import ApprovalCard from '@/components/ApprovalCard';
import VotingCard from '@/components/VotingCard';
import VotingResults from '@/components/VotingResults';
import { databaseRequest } from '@/utils/requests';
import { CommentResponseType } from '@/types/CommentTypes';
import { SingleIdeaResponseType } from '@/types/IdeaTypes';
import NewComment from '@/components/NewComment';
import { Add } from '@mui/icons-material';
import { BoxResponseType } from '@/types/BoxTypes';

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

  const ideaFetch = async () =>
    await databaseRequest('model', {
      model: 'Idea',
      method: 'getIdeaContent',
      arguments: { idea_id: params['idea_id'] },
      decrypt: ['content', 'displayname'],
    }).then((response: SingleIdeaResponseType) => setIdea(response));

  const commentsFetch = async () =>
    await databaseRequest('model', {
      model: 'Comment',
      method: 'getCommentsByIdeaId',
      arguments: { idea_id: Number(params['idea_id']) },
      decrypt: ['content', 'username'],
    }).then((response: CommentResponseType) => setComments(response));

  const getPhase = async () =>
    databaseRequest('model', {
      model: 'Topic',
      method: 'getTopicBaseData',
      arguments: { topic_id: Number(params['box_id']) },
      decrypt: ['name', 'description_public'],
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
      <Stack p={2}>
        {phase === 3 && <VotingResults yourVote={0} />}
        {idea.data && <Idea idea={idea.data} onReload={ideaFetch} disabled={phase > 0} />}
        {idea.data && idea.data.approved != 0 && phase > 0 && (
          <ApprovalCard comment={idea.data.approval_comment} rejected={idea.data.approved < 0} disabled={phase > 1} />
        )}
        {comments && (
          <>
            <Typography variant="h5" py={2}>
              {String(comments.count)} Comments
            </Typography>
            {comments.data && comments.data.map((comment, key) => (
              <IdeaComment
                key={key}
                comment={comment}
                onReload={commentsFetch}
                disabled={phase > 0} />
            ))}
          </>
        )}
        {phase === 0 && (
          <Stack alignItems="center">
            <Fab
              aria-label="add"
              color="primary"
              onClick={toggleDrawer(true)}
              sx={{
                position: 'absolute',
                bottom: 15,
              }}
            >
              <Add />
            </Fab>
          </Stack>
        )}
        <NewComment isOpen={open} closeMethod={closeDrawer} />
      </Stack>
    </Stack>
  );
};

export default IdeaView;
