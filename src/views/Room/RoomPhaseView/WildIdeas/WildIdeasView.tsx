import { AppIcon } from '@/components';
import AddData from '@/components/Data/AddData';
import { IdeaBubble } from '@/components/Idea';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import { getIdeasByRoom } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { Fab, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface RouteParams extends Record<string, string | undefined> {
  room_id: string;
}

/**
 * WildIdeas component displays a list of ideas for a specific room.
 * Users with appropriate permissions can add new ideas.
 *
 * @component
 * @url /room/:room_id/ideas
 */
const WildIdeas = () => {
  const { t } = useTranslation();
  const { room_id } = useParams<RouteParams>();
  const [add, setAdd] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<IdeaType[]>([]);

  const fetchIdeas = useCallback(async () => {
    if (!room_id) return;
    setLoading(true);
    const response = await getIdeasByRoom(room_id);
    setLoading(false);
    setError(response.error);
    if (!response.error && response.data) setIdeas(response.data);
    setLoading(false);
  }, [room_id]);

  const handleCloseAdd = () => {
    fetchIdeas();
    setAdd(false);
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fabStyles = {
    position: 'fixed',
    bottom: 40,
    zIndex: 1000,
  };

  return (
    <Stack alignItems="center" width="100%" px={1} spacing={2}>
      {isLoading && <IdeaBubbleSkeleton />}
      {error && <Typography>{t(error)}</Typography>}
      {!isLoading &&
        ideas.map((idea) => (
          <IdeaBubble
            idea={idea}
            onReload={fetchIdeas}
            key={idea.id}
            comments={idea.sum_comments}
            to={`idea/${idea.hash_id}`}
          />
        ))}
      {checkPermissions(20) && room_id && (
        <>
          <Fab aria-label="add idea" color="primary" sx={fabStyles} onClick={() => setAdd(true)}>
            <AppIcon icon="idea" />
          </Fab>
          <AddData scope="ideas" isOpen={add} onClose={handleCloseAdd} parentId={room_id} />
        </>
      )}
    </Stack>
  );
};

export default WildIdeas;
