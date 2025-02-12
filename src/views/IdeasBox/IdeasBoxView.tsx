import { AppIcon, AppLink } from '@/components';
import BoxCard from '@/components/BoxCard';
import BoxCardSkeleton from '@/components/BoxCard/BoxCardSkeleton';
import { BoxForms } from '@/components/DataForms';
import DelegateVote from '@/components/DelegateVote';
import { IdeaCard } from '@/components/Idea';
import IdeaCardSkeleton from '@/components/Idea/IdeaCard/IdeaCardSkeleton';
import KnowMore from '@/components/KnowMore';
import { deleteBox, editBox, EditBoxArguments, getBox } from '@/services/boxes';
import { getIdeasByBox } from '@/services/ideas';
import { getDelegations } from '@/services/users';
import { BoxType, DelegationType, IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { Button, Drawer, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

/** * Renders "IdeasBox" view
 * url: /room/:room_id/ideas-box/:box_id
 */
const IdeasBoxView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { room_id, box_id, phase } = useParams();

  /**
   * Box data
   */

  const [isBoxLoading, setBoxLoading] = useState(true);
  const [boxError, setBoxError] = useState<string | null>(null);
  const [box, setBox] = useState<BoxType>();
  const [edit, setEdit] = useState<EditBoxArguments>(); // undefined = closed;

  const fetchBox = useCallback(async () => {
    if (!box_id) return;
    setBoxLoading(true);
    const response = await getBox(box_id);
    setBoxError(response.error);
    if (!response.error && response.data) setBox(response.data);
    setBoxLoading(false);
  }, [box_id]);

  const boxEdit = (box: BoxType) => {
    setEdit(box);
  };

  const boxUpdate = async (data: EditBoxArguments) => {
    if (!(typeof edit === 'object') || !edit.hash_id) return;
    const request = await editBox({
      topic_id: edit.hash_id,
      name: data.name,
      description_public: data.description_public,
      description_internal: data.description_internal,
      room_id: data.room_hash_id,
      phase_id: data.phase_id,
      phase_duration_1: data.phase_duration_1,
      phase_duration_2: data.phase_duration_2,
      phase_duration_3: data.phase_duration_3,
      phase_duration_4: data.phase_duration_4,
      status: data.status,
    });
    if (!request.error) boxClose();
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
    const response = await getIdeasByBox(box_id);
    setIdeasError(response.error);
    if (!response.error && response.data) setIdeas(response.data);
    setIdeasLoading(false);
  }, [box_id]);

  /**
   * Delegation data
   */

  const [delegating, setDelegating] = useState(false);
  const [delegates, setDelegates] = useState<DelegationType[]>([]);

  const fetchDelegation = useCallback(async () => {
    if (!box_id) return;
    setIdeasLoading(true);
    const response = await getDelegations(box_id);
    setIdeasError(response.error);
    console.log(response);
    if (!response.error && response.data) setDelegates(response.data);
    setIdeasLoading(false);
  }, [box_id]);

  const closeDelection = () => {
    fetchDelegation();
    setDelegating(false);
  };

  useEffect(() => {
    fetchIdeas();
    fetchBox();
    fetchDelegation();
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
      <Stack direction="row" pt={3} px={1} alignItems="center">
        <Typography variant="h6">
          {box &&
            t(`phases.id-${box.phase_id}`, {
              var: ideas.length,
            })}
        </Typography>
        {phase === '30' && (
          <Stack direction="row" position="relative" alignItems="center" sx={{ ml: 'auto', pr: 3 }}>
            <Typography variant="caption">
              {t('votes.vote').toUpperCase()} {t('ui.common.or')}
            </Typography>
            <Button size="small" sx={{ bgcolor: '#fff' }} onClick={() => setDelegating(true)}>
              {delegates && delegates.length > 0 ? t('delegation.revoke') : t('delegation.delegate')}
            </Button>
            <KnowMore title={t('tooltips.delegate')}>
              <AppIcon icon="delegate" size="small" />
            </KnowMore>
          </Stack>
        )}
      </Stack>
      {/* {checkPermissions(30) && <MoveData id={Number(box_id)} scope="boxes" onClose={() => boxIdeasFetch()} />} */}
      <Grid container spacing={1} pt={1} pb={2}>
        {isIdeasLoading && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ scrollSnapAlign: 'center' }}>
            <IdeaCardSkeleton />
          </Grid>
        )}
        {ideasError && <Typography>{t(ideasError)}</Typography>}
        {!isIdeasLoading &&
          ideas.map((idea, key) => (
            <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }} sx={{ scrollSnapAlign: 'center' }} order={-idea.approved}>
              <AppLink to={`idea/${idea.hash_id}`}>
                <IdeaCard idea={idea} phase={Number(phase) as RoomPhases} />
              </AppLink>
            </Grid>
          ))}
      </Grid>
      <Drawer anchor="bottom" open={!!edit} onClose={boxClose} sx={{ overflowY: 'auto' }}>
        <BoxForms onClose={boxClose} onSubmit={boxUpdate} defaultValues={edit} />
      </Drawer>
      <DelegateVote
        open={delegating}
        delegate={delegates[0] ? delegates[0].user_id_target : undefined}
        onClose={closeDelection}
      />
    </Stack>
  );
};

export default IdeasBoxView;
