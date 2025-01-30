import { AppIcon } from '@/components';
import { IdeaForms } from '@/components/Data/DataForms';
import { IdeaBubble } from '@/components/Idea';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import { addIdea, deleteIdea, editIdea, getIdeasByRoom } from '@/services/ideas';
import { StatusTypes } from '@/types/Generics';
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
  status?: StatusTypes;
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
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<IdeaType[]>([]);
  const [edit, setEdit] = useState<IdeaFormData | boolean>(false); // false = update dialog closed ;true = new idea; IdeaFormData = edit idea;

  const fetchIdeas = useCallback(async () => {
    if (!room_id) return;
    setLoading(true);
    const response = await getIdeasByRoom(room_id);
    if (response.error) setError(response.error);
    if (!response.error && response.data) setIdeas(response.data);
    setLoading(false);
  }, [room_id]);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const onSubmit = (data: IdeaFormData) => {
    if (!edit) return;
    typeof edit === 'boolean' ? newIdea(data) : updateIdea(data);
  };

  const newIdea = async (data: IdeaFormData) => {
    if (!room_id) return;
    const request = await addIdea({
      room_id: room_id,
      title: data.title,
      content: data.content,
      status: data.status,
    });
    if (!request.error) onClose();
  };

  const updateIdea = async (data: IdeaFormData) => {
    if (typeof edit === 'object' && edit.hash_id) {
      const request = await editIdea({
        idea_id: edit.hash_id,
        title: data.title,
        content: data.content,
        status: data.status,
      });
      if (!request.error) onClose();
    }
  };

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
      {checkPermissions(20) && room_id && (
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
            <IdeaForms
              onClose={onClose}
              onSubmit={onSubmit}
              defaultValues={typeof edit !== 'boolean' ? edit : undefined}
            />
          </Drawer>
        </>
      )}
    </Stack>
  );
};

export default WildIdeas;
