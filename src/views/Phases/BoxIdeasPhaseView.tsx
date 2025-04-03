import AddCategoriesButton from '@/components/Buttons/AddCategories';
import { AddCategoryRefProps } from '@/components/Buttons/AddCategories/AddCategoriesButton';
import { IdeaForms } from '@/components/DataForms';
import { IdeaBubble } from '@/components/Idea';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import { getBoxesByPhase } from '@/services/boxes';
import {
  deleteIdea,
  editIdea,
  EditIdeaArguments,
  getIdeasByBox,
  getUserIdeasByPhase,
  IdeaArguments,
} from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { useAppStore } from '@/store/AppStore';
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
  const [appState, dispatch] = useAppStore();

  const { phase } = useParams();

  const addCategory = useRef<AddCategoryRefProps>(null);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<IdeaType[]>([]);
  const [edit, setEdit] = useState<IdeaType>();

  const fetchIdeas = useCallback(async () => {
    if (!phase) return;
    setLoading(true);
    const response = await getUserIdeasByPhase(Number(phase));

    if (response.error) setError(response.error);
    if (!response.error) setIdeas(response.data || []);
    setLoading(false);
  }, [phase]);

  const onEdit = (idea: IdeaType) => {
    setEdit(idea);
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
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.dashboard')]] });
    fetchIdeas();
  }, [phase]);
  return (
    <Stack p={2} sx={{ overflowY: 'auto' }}>
      <Typography variant="h2" py={2}>
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
        <IdeaForms onClose={onClose} defaultValues={typeof edit !== 'boolean' ? edit : undefined} />
      </Drawer>
    </Stack>
  );
};

export default BoxIdeasPhaseView;
