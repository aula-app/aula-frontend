import { AppIcon } from '@/components';
import AddData from '@/components/Data/AddData';
import { IdeaBubble } from '@/components/Idea';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import { addIdeas, getIdeasByRoom } from '@/services/ideas';
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

  interface IdeaFormData {
    title: string;
    content: string;
  }

  const fetchIdeas = useCallback(async () => {
    if (!room_id) return;
    setLoading(true);
    const response = await getIdeasByRoom(room_id);
    setLoading(false);
    setError(response.error);
    if (!response.error && response.data) setIdeas(response.data);
    setLoading(false);
  }, [room_id]);

  const onSubmit = async (data: IdeaFormData) => {
    if (!room_id) return;
    const request = await addIdeas({
      room_id: room_id,
      ...data,
    });
    if (!request.error) onClose();
  };

  const onClose = () => {
    setAdd(false);
    fetchIdeas();
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
    <Stack alignItems="center" width="100%" spacing={2}>
      {isLoading && <IdeaBubbleSkeleton />}
      {error && <Typography>{t(error)}</Typography>}
      {!isLoading && ideas.map((idea) => <IdeaBubble key={idea.id} idea={idea} />)}
      {checkPermissions(20) && room_id && (
        <>
          <Fab aria-label="add idea" color="primary" sx={fabStyles} onClick={() => setAdd(true)}>
            <AppIcon icon="idea" />
          </Fab>
          <AddData scope="ideas" isOpen={add} onClose={onClose} onSubmit={onSubmit} parentId={room_id} />
        </>
      )}
    </Stack>
  );
};

export default WildIdeas;
