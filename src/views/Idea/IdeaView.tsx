import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import WildIdea from '@/components/WildIdea';
import IdeaComment from '@/components/IdeaComment';
import ApprovalCard from '@/components/ApprovalCard';
import VotingCard from '@/components/VotingCard';
import VotingResults from '@/components/VotingResults';
import { databaseRequest } from '@/utils/requests';
import { CommentResponse } from '@/types/CommentTypes';
import { Idea, SingleIdeaRequest } from '@/types/IdeaType';

/**
 * Renders "Idea" view
 * url: /
 */
const IdeaView = () => {
  const params = useParams();
  const [data, setData] = useState({} as Idea);
  const [comments, setComments] = useState({} as CommentResponse);

  const dataFetch = async () =>
    await databaseRequest('model', {
      model: 'Idea',
      method: 'getIdeaContent',
      arguments: { idea_id: Number(params['ideaId']) },
      decrypt: ['content', 'displayname'],
    });

  const commentsFetch = async () =>
    await databaseRequest('model', {
      model: 'Comment',
      method: 'getCommentsByIdeaId',
      arguments: { idea_id: Number(params['ideaId']) },
      decrypt: ['content'],
    });

  const updateData = () => dataFetch().then((response: SingleIdeaRequest) => setData(response.data));
  const updateComments = () => commentsFetch().then((response: CommentResponse) => setComments(response));
  useEffect(() => {
    updateData();
    updateComments();
  }, []);

  return (
    <Stack width="100%" height="100%" overflow="auto">
      <VotingCard />
      <Stack p={2}>
        <VotingResults yourVote="against" />
        <WildIdea idea={data} />
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
