import { AppIcon } from '@/components';
import { IdeaForms } from '@/components/DataForms';
import { IdeaBubble } from '@/components/Idea';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import { useAppStore } from '@/store/AppStore';
import { getRoom } from '@/services/rooms';
import { deleteIdea, getIdeasByRoom } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { Drawer, Fab, Stack, Typography } from '@mui/material';
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
  const { phase, room_id } = useParams<RouteParams>();
  const [appState, dispatch] = useAppStore();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<IdeaType[]>([]);
  const [edit, setEdit] = useState<IdeaType | boolean>(false); // false = update dialog closed ;true = new idea; IdeaType = edit idea;

  const getRoomName = (id: string) => {
    return getRoom(id).then((response) => {
      if (response.error || !response.data) return;
      let roomName = response.data.room_name;
      return roomName;
    });
  };

  const fetchIdeas = useCallback(async () => {
    if (!room_id) return;
    setLoading(true);
    const response = await getIdeasByRoom(room_id);
    if (response.error) setError(response.error);
    if (!response.error && response.data) setIdeas(response.data);
    setLoading(false);

    let roomName = await getRoomName(room_id);
    roomName = roomName ? roomName : 'aula';
    dispatch({
      action: 'SET_BREADCRUMB',
      breadcrumb: [
        [roomName, `/room/${room_id}/phase/0`],
        [t(`phases.name-${phase}`), `/room/${room_id}/phase/${phase}`],
      ],
    });
  }, [room_id]);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const onEdit = (idea: IdeaType) => {
    setEdit(idea);
  };

  const onDelete = async (id: string) => {
    const request = await deleteIdea(id);
    if (!request.error) onClose();
  };

  const onClose = () => {
    setEdit(false);
    fetchIdeas();
  };

  return (
    <Stack alignItems="center" width="100%" spacing={2}>
      {isLoading && <IdeaBubbleSkeleton />}
      {error && <Typography>{t(error)}</Typography>}
      {!isLoading &&
        ideas.map((idea) => (
          <IdeaBubble
            key={idea.id}
            idea={idea}
            to={`idea/${idea.hash_id}`}
            onEdit={() => onEdit(idea)}
            onDelete={() => onDelete(idea.hash_id)}
          />
        ))}
      {checkPermissions('ideas', 'create') && room_id && (
        <>
          <Fab
            aria-label="add idea"
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 40,
              zIndex: 1000,
            }}
            onClick={() => setEdit(true)}
          >
            <AppIcon icon="idea" />
          </Fab>
          <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
            <IdeaForms onClose={onClose} defaultValues={typeof edit !== 'boolean' ? edit : undefined} />
          </Drawer>
        </>
      )}
    </Stack>
  );
};

export default WildIdeas;
