import { AppIcon, EmptyState, ScopeHeader } from '@/components';
import BoxCard from '@/components/BoxCard';
import BoxCardSkeleton from '@/components/BoxCard/BoxCardSkeleton';
import { BoxForms } from '@/components/DataForms';
import SurveyForms from '@/components/DataForms/SurveyForms';
import { deleteBox, getBoxesByPhase } from '@/services/boxes';
import { getRoom } from '@/services/rooms';
import { useAppStore } from '@/store/AppStore';
import { BoxType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { Drawer, Fab, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchAndSort, createTextFilter, useFilter } from '@/hooks';
import { useParams } from 'react-router-dom';

/**
 * Renders "IdeaBoxes" view as the second view in the Room Phases
 *
 * @url /room/:room_id/phase/10
 */
const BoxPhaseView = () => {
  const { t } = useTranslation();
  const { room_id, phase } = useParams();

  // Manage search and sort state for boxes
  const { searchQuery, sortKey, sortDirection, scopeHeaderProps } = useSearchAndSort({
    sortOptions: [
      { value: 'created', labelKey: 'settings.columns.created' },
      { value: 'name', labelKey: 'settings.columns.title' },
      { value: 'ideas_num', labelKey: 'settings.columns.ideas_num' },
    ],
  });

  // Create filter function for boxes (searches in name and description)
  const boxFilterFunction = useMemo(() => createTextFilter<BoxType>(['name', 'description_public']), []);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<BoxType[]>([]);

  // Apply filtering to boxes
  const filteredBoxes = useFilter({
    data: boxes,
    filterValue: searchQuery,
    filterFunction: boxFilterFunction,
  });

  // Sort the filtered boxes
  const sortedBoxes = useMemo(() => {
    return filteredBoxes.slice().sort((a, b) => {
      const valueA = a[sortKey as keyof BoxType];
      const valueB = b[sortKey as keyof BoxType];

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      const comparison = String(valueA).localeCompare(String(valueB));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredBoxes, sortKey, sortDirection]);

  const [edit, setEdit] = useState<BoxType | boolean>(); // undefined = update dialog closed; true = new idea; EditArguments = edit idea;
  const [appState, dispatch] = useAppStore();

  const getRoomName = (id: string) => {
    return getRoom(id).then((response) => {
      if (response.error || !response.data) return;
      let roomName = response.data.room_name;
      roomName = roomName ? roomName : 'aula';
      return roomName;
    });
  };

  const [addSurvey, setAddSurvey] = useState(false);

  const fetchBoxes = useCallback(async () => {
    if (!room_id || !phase) return;
    setLoading(true);
    const response = await getBoxesByPhase(Number(phase), room_id);
    setError(response.error);
    setBoxes(response.data || []);
    setLoading(false);

    let roomName = await getRoomName(room_id);

    dispatch({
      action: 'SET_BREADCRUMB',
      breadcrumb: [
        [roomName, `/room/${room_id}/phase/0`],
        [t(`phases.name-${phase}`), `/room/${room_id}/phase/${phase}`],
      ],
    });
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
    setAddSurvey(false);
    fetchBoxes();
  };

  return (
    <Stack alignItems="center" flex={1}>
      {isLoading ? (
        <Grid container spacing={2} p={1} width="100%">
          <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
            <BoxCardSkeleton />
          </Grid>
        </Grid>
      ) : (
        <Stack width="100%" flex={1}>
          <ScopeHeader
            title={t(`phases.box-${phase}`, {
              var: boxes.length === 1 ? t('scopes.boxes.name') : t('scopes.boxes.plural'),
            })}
            scopeKey="boxes"
            totalCount={boxes.length}
            {...scopeHeaderProps}
          />
          <Grid container spacing={2} p={2} pt={0} flex={1}>
            {sortedBoxes.length === 0 ? (
              <EmptyState title={t('ui.empty.boxes.title')} description={t('ui.empty.boxes.description')} />
            ) : (
              sortedBoxes.map((box) => (
                <Grid key={box.hash_id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
                  <BoxCard
                    box={box}
                    onEdit={() => {
                      setEdit(box);
                    }}
                    onDelete={() => boxDelete(box.hash_id)}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Stack>
      )}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          position: 'fixed',
          bottom: 40,
          zIndex: 1000,
        }}
      >
        {checkPermissions('boxes', 'create') && Number(phase) === 10 && (
          <Fab aria-label="add idea" color="primary" onClick={() => setEdit(true)} data-testid="add-idea-button">
            <AppIcon icon="box" />
          </Fab>
        )}
        <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
          <BoxForms onClose={onClose} defaultValues={typeof edit === 'object' ? edit : undefined} />
        </Drawer>
        {checkPermissions('surveys', 'create') && Number(phase) === 30 && (
          <>
            <Fab aria-label="add" color="primary" onClick={() => setAddSurvey(true)}>
              <AppIcon icon="survey" />
            </Fab>
            <Drawer anchor="bottom" open={!!addSurvey} onClose={onClose} sx={{ overflowY: 'auto' }}>
              <SurveyForms onClose={onClose} />
            </Drawer>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default BoxPhaseView;
