import { AlterData } from '@/components/Data';
import { IdeaBubble } from '@/components/IdeaComponents';
import { IdeasResponseType } from '@/types/RequestTypes';
import { databaseRequest, localStorageGet, parseJwt } from '@/utils';
import { Add } from '@mui/icons-material';
import { Fab, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Renders "WildIdeas" view
 * url: /room/:room_id/ideas
 */

const WildIdeas = () => {
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const params = useParams();
  const [ideas, setIdeas] = useState<IdeasResponseType>();
  const [add, setAdd] = useState(false);

  const ideasFetch = async () =>
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeasByRoom',
      arguments: { room_id: Number(params['room_id']) },
    }).then((response) => setIdeas(response));

  const closeAdd = () => {
    ideasFetch();
    setAdd(false);
  };

  useEffect(() => {
    ideasFetch();
  }, []);

  return (
    <Stack alignItems="center" width="100%" px={1}>
      {ideas &&
        ideas.data &&
        ideas.data.map((idea) => (
          <IdeaBubble
            idea={idea}
            onReload={ideasFetch}
            key={idea.id}
            comments={idea.sum_comments}
            to={`idea/${idea.id}`}
          />
        ))}
      {jwt_payload.user_level >= 20 && (
        <>
          <Fab
            aria-label="add"
            color="primary"
            sx={{
              position: 'absolute',
              bottom: 40,
            }}
            onClick={() => setAdd(true)}
          >
            <Add />
          </Fab>
          <AlterData scope="ideas" isOpen={add} onClose={closeAdd} otherData={{ room_id: params.room_id }} />
        </>
      )}
    </Stack>
  );
};

export default WildIdeas;
