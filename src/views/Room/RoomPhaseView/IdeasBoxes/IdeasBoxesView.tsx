import { AppIcon } from '@/components';
import BoxCard from '@/components/BoxCard';
import BoxCardSkeleton from '@/components/BoxCard/BoxCardSkeleton';
import BoxForms from '@/components/Data/DataForms/BoxForms';
import { addBox, deleteBox, editBox, getBoxesByPhase } from '@/services/boxes';
import { BoxType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { checkPermissions } from '@/utils';
import { Drawer, Fab, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export interface BoxFormData {
  name: string;
  description_public: string;
}

/** * Renders "IdeaBoxes" view
 * url: /room/:room_id/:phase
 */

const IdeasBoxesView = () => {
  const { t } = useTranslation();
  const { room_id, phase } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<BoxType[]>([]);
  const [edit, setEdit] = useState<string | boolean>(false); // true = new idea; id = edit idea; false = closed;
  const [defaultValues, setDefaultValues] = useState<BoxFormData>();

  const fetchBoxes = useCallback(async () => {
    if (!room_id || !phase) return;
    setLoading(true);
    const response = await getBoxesByPhase(Number(phase), room_id);
    setLoading(false);
    setError(response.error);
    if (!response.error && response.data) setBoxes(response.data);
    setLoading(false);
  }, [room_id, phase]);

  useEffect(() => {
    fetchBoxes();
  }, []);

  const onSubmit = (data: BoxFormData) => {
    if (!edit) return;
    typeof edit === 'string' ? updateBox(data) : newBox(data);
  };

  const newBox = async (data: BoxFormData) => {
    if (!room_id || !phase) return;
    const request = await addBox({
      room_id: room_id,
      phase_id: Number(phase) as RoomPhases,
      ...data,
    });
    if (!request.error) onClose();
  };

  const updateBox = async (data: BoxFormData) => {
    if (typeof edit !== 'string') return;
    const request = await editBox({
      topic_id: edit,
      ...data,
    });
    if (!request.error) onClose();
  };

  const onEdit = (box: BoxType) => {
    setDefaultValues({
      name: box.name,
      description_public: box.description_public,
    });
    setEdit(box.hash_id);
  };

  const onDelete = async (id: string) => {
    const request = await deleteBox(id);
    if (!request.error) onClose();
  };

  const onClose = () => {
    setDefaultValues(undefined);
    setEdit(false);
    fetchBoxes();
  };

  return (
    <Stack alignItems="center">
      <Grid container spacing={2} p={1} width="100%">
        {isLoading && (
          <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
            <BoxCardSkeleton />
          </Grid>
        )}
        {error && <Typography>{t(error)}</Typography>}
        {!isLoading &&
          boxes.map((box) => (
            <Grid key={box.hash_id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
              <BoxCard box={box} onEdit={() => onEdit(box)} onDelete={() => onDelete(box.hash_id)} />
            </Grid>
          ))}
      </Grid>
      {checkPermissions(30) && room_id && (
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
            <BoxForms onClose={onClose} onSubmit={onSubmit} defaultValues={defaultValues} />
          </Drawer>
        </>
      )}
    </Stack>
  );
};

export default IdeasBoxesView;
