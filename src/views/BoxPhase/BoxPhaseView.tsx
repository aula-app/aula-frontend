import { AppIcon } from '@/components';
import BoxCard from '@/components/BoxCard';
import BoxCardSkeleton from '@/components/BoxCard/BoxCardSkeleton';
import { BoxForms } from '@/components/DataForms';
import { deleteBox, getBoxesByPhase } from '@/services/boxes';
import { getRoom } from '@/services/rooms';
import { BoxType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { useAppStore } from '@/store/AppStore';
import { Drawer, Fab, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

/** * Renders "IdeaBoxes" view
 * url: /room/:room_id/:phase
 */

const BoxPhaseView = () => {
  const { t } = useTranslation();
  const { room_id, phase } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<BoxType[]>([]);
  const [edit, setEdit] = useState<BoxType | true>(); // undefined = update dialog closed; true = new idea; EditArguments = edit idea;
  const [appState, dispatch] = useAppStore();
 
  const getRoomName = (id: string) => {
    return getRoom(id).then((response) => {
      if (response.error || !response.data) return;
      let roomName = response.data.room_name;
      roomName = roomName?roomName:'aula';
      return roomName;
    });
  };

  const fetchBoxes = useCallback(async () => {
    if (!room_id || !phase) return;
    setLoading(true);
    const response = await getBoxesByPhase(Number(phase), room_id);
    setError(response.error);
    if (!response.error) setBoxes(response.data || []);
    setLoading(false);

    let roomName = await getRoomName(room_id);

    dispatch({'action': 'SET_BREADCRUMB', "breadcrumb": [[roomName, `/room/${room_id}/phase/0`], [t(`phases.name-${phase}`), `/room/${room_id}/phase/${phase}`]]});
  }, [room_id, phase]);

  useEffect(() => {
    fetchBoxes();
  }, [phase]);

  const boxDelete = async (id: string) => {
    const request = await deleteBox(id);
    if (!request.error) onClose();
  };

  const onClose = () => {
    setEdit(undefined);
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
              <BoxCard box={box} onEdit={() => setEdit(box)} onDelete={() => boxDelete(box.hash_id)} />
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
            <AppIcon icon="box" />
          </Fab>
          <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
            <BoxForms onClose={onClose} defaultValues={typeof edit === 'object' ? edit : undefined} />
          </Drawer>
        </>
      )}
    </Stack>
  );
};

export default BoxPhaseView;
