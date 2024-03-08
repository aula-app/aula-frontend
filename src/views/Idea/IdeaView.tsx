import { Stack, Typography } from '@mui/material';
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

/**
 * Renders "Idea" view
 * url: room/:room_id/.../idea/:idea_id
 */
const IdeaView = () => {
  const params = useParams();
  const [data, setData] = useState({} as SingleIdeaResponseType);
  const [comments, setComments] = useState({} as CommentResponseType);

  const dataFetch = async () =>
    await databaseRequest('model', {
      model: 'Idea',
      method: 'getIdeaContent',
      arguments: { idea_id: Number(params['idea_id']) },
      decrypt: ['content', 'displayname'],
    })
    .then((response: SingleIdeaResponseType) => setData(response));

  const commentsFetch = async () =>
    await databaseRequest('model', {
      model: 'Comment',
      method: 'getCommentsByidea_id',
      arguments: { idea_id: Number(params['idea_id']) },
      decrypt: ['content'],
    })
    .then((response: CommentResponseType) => setComments(response));

  useEffect(() => {
    dataFetch();
    commentsFetch();
  }, []);

  return (
    <Stack width="100%" height="100%" overflow="auto">
      <VotingCard />
      <Stack p={2}>
        <VotingResults yourVote="against" />
        <Idea idea={data.data} />
        <ApprovalCard disabled />
        <Typography variant="h5" py={2}>
          { String(comments.count) } Comments
        </Typography>
        { comments.data && comments.data.map(comment => (
          <IdeaComment comment={comment} />
        ))}
      </Stack>
    </Stack>
  );
};

export default IdeaView;
