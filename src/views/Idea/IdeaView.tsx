import { Drawer, Fab, Stack, Typography } from '@mui/material';
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
import NewComment from '@/components/newComment';
import { Add } from '@mui/icons-material';

/**
 * Renders "Idea" view
 * url: room/:room_id/.../idea/:idea_id
 */
const IdeaView = () => {
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [idea, setIdea] = useState({} as SingleIdeaResponseType);
  const [comments, setComments] = useState({} as CommentResponseType);

  const dataFetch = async () =>
    await databaseRequest('model', {
      model: 'Idea',
      method: 'getIdeaContent',
      arguments: { idea_id: Number(params['idea_id']) },
      decrypt: ['content', 'displayname'],
    }).then((response: SingleIdeaResponseType) => {
      setIdea(response);
    });

  const commentsFetch = async () =>
    await databaseRequest('model', {
      model: 'Comment',
      method: 'getCommentsByIdeaId',
      arguments: { idea_id: Number(params['idea_id']) },
      decrypt: ['content'],
    }).then((response: CommentResponseType) => setComments(response));

  useEffect(() => {
    dataFetch();
    commentsFetch();
  }, []);

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);
  const closeDrawer = () => {
    setOpen(false);
    commentsFetch();
  };
  return (
    <Stack width="100%" height="100%" overflow="auto">
      {params['box_id'] && <VotingCard />}
      <Stack p={2}>
        {params['box_id'] && <VotingResults yourVote="against" />}
        {idea.data && <Idea idea={idea.data} />}
        {params['box_id'] && <ApprovalCard disabled />}
        {comments && (
          <>
            <Typography variant="h5" py={2}>
              {String(comments.count)} Comments
            </Typography>
            <Fab
              aria-label="add"
              color="primary"
              onClick={toggleDrawer(true)}
              sx={{
                position: 'absolute',
                bottom: 15,
                right: 15
              }}>
              <Add />
            </Fab>
            {comments.data && comments.data.map((comment) => <IdeaComment comment={comment} />)}
          </>
        )}
        <Drawer anchor="bottom" open={open} onClose={toggleDrawer(false)}>
          <NewComment closeMethod={closeDrawer} />
        </Drawer>
      </Stack>
    </Stack>
  );
};

export default IdeaView;
