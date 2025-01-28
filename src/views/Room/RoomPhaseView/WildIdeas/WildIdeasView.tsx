import { AppIcon } from '@/components';
import { IdeaForms } from '@/components/Data/DataForms';
import { IdeaBubble } from '@/components/Idea';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import { addIdeas, deleteIdea, editIdea, getIdeasByRoom } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { Drawer, Fab, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface RouteParams extends Record<string, string | undefined> {
  room_id: string;
}

export interface IdeaFormData {
  title: string;
  content: string;
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
  const [edit, setEdit] = useState<string | boolean>(false); // true = new idea; id = edit idea; false = closed;
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<IdeaType[]>([]);
  const [defaultValues, setDefaultValues] = useState<IdeaFormData>();

  const fetchIdeas = useCallback(async () => {
    if (!room_id) return;
    setLoading(true);
    const response = await getIdeasByRoom(room_id);
    setLoading(false);
    setError(response.error);
    if (!response.error && response.data) setIdeas(response.data);
    setLoading(false);
  }, [room_id]);

  const onSubmit = (data: IdeaFormData) => {
    if (!edit) return;
    typeof edit === 'string' ? updateIdea(data) : addIdea(data);
  };

  const addIdea = async (data: IdeaFormData) => {
    if (!room_id) return;
    const request = await addIdeas({
      room_id: room_id,
      ...data,
    });
    if (!request.error) onClose();
  };

  const updateIdea = async (data: IdeaFormData) => {
    if (typeof edit !== 'string') return;
    const request = await editIdea({
      idea_id: edit,
      ...data,
    });
    if (!request.error) onClose();
  };

  const onEdit = (idea: IdeaType) => {
    setDefaultValues({
      title: idea.title,
      content: idea.content,
    });
    setEdit(idea.hash_id);
  };

  const onDelete = async (id: string) => {
    const request = await deleteIdea(id);
    if (!request.error) onClose();
  };

  const onClose = () => {
    setDefaultValues(undefined);
    setEdit(false);
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
      {!isLoading &&
        ideas.map((idea) => (
          <IdeaBubble key={idea.id} idea={idea} onEdit={() => onEdit(idea)} onDelete={() => onDelete(idea.hash_id)} />
        ))}
      {checkPermissions(20) && room_id && (
        <>
          <Fab aria-label="add idea" color="primary" sx={fabStyles} onClick={() => setAdd(true)}>
            <AppIcon icon="idea" />
          </Fab>
          <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
            <IdeaForms onClose={onClose} onSubmit={onSubmit} defaultValues={defaultValues} />
          </Drawer>
        </>
      )}
    </Stack>
  );
};

export default WildIdeas;
