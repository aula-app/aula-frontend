import { AppIcon } from '@/components';
import EditData from '@/components/Data/EditData';
import { IdeaBubble } from '@/components/Idea';
import { IdeasResponseType } from '@/types/RequestTypes';
import { checkPermissions, databaseRequest } from '@/utils';
import { Fab, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Renders "WildIdeas" view
 * url: /room/:room_id/ideas
 */

const WildIdeas = () => {
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
      {checkPermissions(20) && (
        <>
          <Fab
            aria-label="add"
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 40,
            }}
            onClick={() => setAdd(true)}
          >
            <AppIcon icon="idea" />
          </Fab>
          <EditData scope="ideas" isOpen={add} onClose={closeAdd} otherData={{ room_id: params.room_id }} />
        </>
      )}
    </Stack>
  );
};

export default WildIdeas;
