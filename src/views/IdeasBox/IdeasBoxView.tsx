import BoxCard from '@/components/BoxCard';
import BoxCardSkeleton from '@/components/BoxCard/BoxCardSkeleton';
import AddIdeasButton from '@/components/Buttons/AddIdeas';
import DelegateButton from '@/components/Buttons/DelegateButton';
import { BoxForms } from '@/components/DataForms';
import { IdeaCard } from '@/components/Idea';
import IdeaCardSkeleton from '@/components/Idea/IdeaCard/IdeaCardSkeleton';
import KnowMore from '@/components/KnowMore';
import { deleteBox, getBox } from '@/services/boxes';
import { getIdeasByBox } from '@/services/ideas';
import { getRoom } from '@/services/rooms';
import { getQuorum } from '@/services/vote';
import { useAppStore } from '@/store/AppStore';
import { BoxType, IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { checkPermissions } from '@/utils';
import { Drawer, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

/** * Renders "IdeasBox" view
 * url: /room/:room_id/ideas-box/:box_id
 */
const IdeasBoxView = () => {
  const { t } = useTranslation();
  const [appState, dispatch] = useAppStore();
  const navigate = useNavigate();
  const { room_id, box_id, phase } = useParams();
  const [quorum, setQuorum] = useState<number>(0);

  async function fetchQuorum() {
    getQuorum().then((response) => {
      if (response.error || !response.data) return;
      setQuorum(
        !!phase && Number(phase) >= 30 ? Number(response.data.quorum_votes) : Number(response.data.quorum_wild_ideas)
      );
    });
  }

  /**
   * Box data
   */

  const [isBoxLoading, setBoxLoading] = useState(true);
  const [boxError, setBoxError] = useState<string | null>(null);
  const [box, setBox] = useState<BoxType>();
  const [edit, setEdit] = useState<BoxType>(); // undefined = closed;
  const [boxPhase, setBoxPhase] = useState<string | null>(phase ? phase : '');

  const getRoomName = (id: string) => {
    return getRoom(id).then((response) => {
      if (response.error || !response.data) return '';
      let roomName = response.data.room_name;
      return roomName;
    });
  };

  const fetchBox = useCallback(async () => {
    if (!box_id) return;
    setBoxLoading(true);
    const response = await getBox(box_id);
    setBoxError(response.error);
    if (!response.error && response.data) setBox(response.data);
    setBoxLoading(false);

    await fetchQuorum();

    let roomName = 'aula';
    if (room_id) roomName = await getRoomName(room_id);

    const currentBoxPhase = response.data ? response.data.phase_id : '';
    if (currentBoxPhase != boxPhase && response.data) {
      setBoxPhase(currentBoxPhase);
      dispatch({
        action: 'SET_BREADCRUMB',
        breadcrumb: [
          [roomName, `/room/${room_id}/phase/0`],
          [t(`phases.name-${currentBoxPhase}`), `/room/${room_id}/phase/${currentBoxPhase}`],
          [response.data.name, ''],
        ],
      });
      navigate(`/room/${room_id}/phase/${currentBoxPhase}/idea-box/${box_id}`, { replace: true });
    } else {
      if (response.data && response.data.name)
        dispatch({
          action: 'SET_BREADCRUMB',
          breadcrumb: [
            [roomName, `/room/${room_id}/phase/0`],
            [t(`phases.name-${phase}`), `/room/${room_id}/phase/${phase}`],
            [response.data.name, ''],
          ],
        });
    }
  }, [box_id]);

  const boxEdit = (box: BoxType) => {
    setEdit(box);
  };

  const boxDelete = async () => {
    if (!box_id) return;
    const request = await deleteBox(box_id);
    if (!request.error) navigate(`/room/${room_id}/phase/${phase}`);
  };

  const boxClose = () => {
    setEdit(undefined);
    fetchBox();
  };

  /**
   * Box's ideas data
   */

  const [isIdeasLoading, setIdeasLoading] = useState(true);
  const [ideasError, setIdeasError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<IdeaType[]>([]);

  const fetchIdeas = useCallback(async () => {
    if (!box_id) return;
    setIdeasLoading(true);
    const response = await getIdeasByBox({ topic_id: box_id });
    setIdeasError(response.error);
    if (!response.error && response.data) setIdeas(response.data);
    setIdeasLoading(false);
  }, [box_id]);

  useEffect(() => {
    fetchIdeas();
    fetchBox();
  }, []);

  return (
    <Stack
      height="100%"
      flexGrow={1}
      position="relative"
      gap={1}
      sx={{
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
      }}
    >
      {isBoxLoading && <BoxCardSkeleton />}
      {boxError && <Typography>{t(boxError)}</Typography>}
      {!isBoxLoading && box && <BoxCard box={box} onDelete={() => boxDelete()} onEdit={() => boxEdit(box)} disabled />}
      <Stack direction="row" pt={3} px={1} alignItems="center" flexWrap="wrap" gap={1}>
        <Typography variant="h6">
          {box &&
            t(`phases.id-${box.phase_id}`, {
              var: ideas.length,
            })}
        </Typography>
        {Number(phase) === 30 && checkPermissions('ideas', 'vote') && (
          <KnowMore title={t('tooltips.delegate')} sx={{ ml: 'auto' }}>
            <DelegateButton />
          </KnowMore>
        )}
      </Stack>
      <Grid container spacing={1} pt={1} pb={2}>
        {isIdeasLoading && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ scrollSnapAlign: 'center' }}>
            <IdeaCardSkeleton />
          </Grid>
        )}
        {ideasError && <Typography>{t(ideasError)}</Typography>}
        {!isIdeasLoading && box && (
          <>
            {ideas
              .filter((idea) => (Number(phase) >= 30 ? idea.approved > 0 : true))
              .map((idea, key) => (
                <IdeaCard idea={idea} quorum={quorum} phase={Number(box.phase_id) as RoomPhases} key={key} />
              ))}
            {checkPermissions('boxes', 'addIdea') && Number(phase) < 20 && (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ scrollSnapAlign: 'center' }}>
                <AddIdeasButton ideas={ideas} onClose={fetchIdeas} />
              </Grid>
            )}
          </>
        )}
      </Grid>
      <Drawer anchor="bottom" open={!!edit} onClose={boxClose} sx={{ overflowY: 'auto' }}>
        <BoxForms onClose={boxClose} defaultValues={edit} />
      </Drawer>
    </Stack>
  );
};

export default IdeasBoxView;
