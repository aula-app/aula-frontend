import AddCategoriesButton from '@/components/Buttons/AddCategories';
import { AddCategoryRefProps } from '@/components/Buttons/AddCategories/AddCategoriesButton';
import { IdeaForms } from '@/components/DataForms';
import { IdeaBubble } from '@/components/Idea';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import { getBoxesByPhase } from '@/services/boxes';
import { deleteIdea, editIdea, EditIdeaArguments, getIdeasByBox, IdeaArguments } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { Drawer, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

/**
 * Renders "Phase" view
 * url: /Phase/0
 */

const BoxIdeasPhaseView = () => {
  const { t } = useTranslation();
  const { phase } = useParams();

  const addCategory = useRef<AddCategoryRefProps>(null);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<IdeaType[]>([]);
  const [edit, setEdit] = useState<IdeaType>();

  const fetchIdeas = useCallback(async () => {
    if (!phase) return;
    setLoading(true);
    const boxes = await getBoxesByPhase(Number(phase));
    if (!boxes.data) return;
    const responses = await Promise.all(boxes.data.map((box) => getIdeasByBox(box.hash_id)));
    const response = responses.flat()[0];
    if (response.error) setError(response.error);
    if (!response.error && response.data) setIdeas(response.data);
    setLoading(false);
  }, [phase]);

  const updateIdea = async (data: EditIdeaArguments) => {
    if (typeof edit === 'object' && edit.hash_id) {
      const request = await editIdea({
        idea_id: edit.hash_id,
        title: data.title,
        content: data.content,
        status: data.status,
      });
      if (request.error) {
        setError(request.error);
        return;
      }
      addCategory.current?.setNewIdeaCategory(edit.hash_id);
      onClose();
    }
  };

  const onEdit = (idea: IdeaType) => {
    setEdit(idea);
  };

  const onSubmit = (data: IdeaArguments) => {
    if (!edit) return;
    updateIdea(data as EditIdeaArguments);
  };

  const onDelete = async (id: string) => {
    const request = await deleteIdea(id);
    if (!request.error) onClose();
  };

  const onClose = () => {
    setEdit(undefined);
    fetchIdeas();
  };

  useEffect(() => {
    fetchIdeas();
  }, [phase]);
  return (
    <Stack p={2} sx={{ overflowY: 'auto' }}>
      <Typography variant="h5" py={2}>
        {t(`phases.name-${phase}`)}
      </Typography>
      <Grid container spacing={2} p={1}>
        {isLoading && (
          <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
            <IdeaBubbleSkeleton />
          </Grid>
        )}
        {error && <Typography color="error">{error}</Typography>}
        {!isLoading &&
          ideas.map((idea) => (
            <Grid key={idea.hash_id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
              <IdeaBubble
                idea={idea}
                to={`/room/${idea.room_hash_id}/phase/${phase}/idea/${idea.hash_id}`}
                onEdit={() => onEdit(idea)}
                onDelete={() => onDelete(idea.hash_id)}
              />
            </Grid>
          ))}
      </Grid>
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <IdeaForms
          onClose={onClose}
          onSubmit={onSubmit}
          defaultValues={typeof edit !== 'boolean' ? (edit as IdeaArguments) : undefined}
        >
          <AddCategoriesButton ideas={!!edit ? [edit.hash_id] : []} ref={addCategory} />
        </IdeaForms>
      </Drawer>
    </Stack>
  );
};

export default BoxIdeasPhaseView;
