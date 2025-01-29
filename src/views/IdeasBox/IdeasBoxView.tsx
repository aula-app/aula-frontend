import { AppIcon, AppLink } from '@/components';
import BoxCard from '@/components/BoxCard';
import BoxCardSkeleton from '@/components/BoxCard/BoxCardSkeleton';
import { MoveData } from '@/components/Data';
import BoxForms from '@/components/Data/DataForms/BoxForms';
import { IdeaCard } from '@/components/Idea';
import IdeaCardSkeleton from '@/components/Idea/IdeaCard/IdeaCardSkeleton';
import KnowMore from '@/components/KnowMore';
import { deleteBox, editBox, getBox, getBoxDelegation } from '@/services/boxes';
import { getIdeasByBox } from '@/services/ideas';
import { DelegationType } from '@/types/Delegation';
import { BoxType, IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { checkPermissions, databaseRequest } from '@/utils';
import { Button, Drawer, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { BoxFormData } from '../BoxPhase/BoxPhaseView';
import { grey } from '@mui/material/colors';

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
  const [edit, setEdit] = useState<BoxFormData>(); // undefined = closed;

  const fetchBox = useCallback(async () => {
    if (!box_id) return;
    setBoxLoading(true);
    const response = await getBox(box_id);
    setBoxError(response.error);
    if (!response.error && response.data) setBox(response.data);
    setBoxLoading(false);
  }, [box_id]);

  const boxEdit = (box: BoxType) => {
    setEdit({
      name: box.name,
      description_public: box.description_public,
      topic_id: box.hash_id,
    });
  };

  const boxUpdate = async (data: BoxFormData) => {
    if (!(typeof edit === 'object') || !edit.topic_id) return;
    const request = await editBox(data);
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

  const [delegationStatus, setDelegationStatus] = useState<DelegationType[]>([]);
  //const [delegationDialog, setDelegationDialog] = useState(false);

  const fetchDelegation = useCallback(async () => {
    if (!box_id) return;
    setIdeasLoading(true);
    const response = await getBoxDelegation(box_id);
    setIdeasError(response.error);
    if (!response.error && response.data) setDelegationStatus(response.data);
    setIdeasLoading(false);
  }, [box_id]);

  // const getDelegation = async () =>
  //   await databaseRequest(
  //     {
  //       model: 'User',
  //       method: 'getDelegationStatus',
  //       arguments: { topic_id: box_id },
  //     },
  //     ['user_id']
  //   ).then((response) => {
  //     if (!response.success || !response.data) return;
  //     setDelegationStatus(response.data as DelegationType[]);
  //   });

  // const closeAdd = () => {
  //   boxIdeasFetch();
  //   setAdd(false);
  // };

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
          {t(delegationStatus.length > 0 ? `delegation.status.delegated` : `delegation.status.undelegated`, {
            var: ideas.length,
          })}
        </Typography>
        {phase === '30' && (
          <Stack direction="row" position="relative" alignItems="center" sx={{ ml: 'auto', pr: 3 }}>
            <Typography variant="caption">
              {t('votes.vote').toUpperCase()} {t('ui.common.or')}
            </Typography>
            <Button size="small" sx={{ bgcolor: '#fff' }} onClick={() => {}}>
              {delegationStatus && delegationStatus.length > 0 ? t('delegation.revoke') : t('delegation.delegate')}
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
      {/* {checkPermissions(20) && phase === '10' && (
          <>
            <Fab
              aria-label="add"
              color="primary"
              sx={{
                position: 'fixed',
                bottom: 40,
                alignSelf: 'center',
              }}
              onClick={() => setAdd(true)}
            >
              <AppIcon icon="idea" />
            </Fab>
            <EditData scope="ideas" isOpen={add} onClose={closeAdd} otherData={{ room_id: params.room_id }} />
          </>
        )}
      </Stack>
      {delegationStatus && (
        <DelegateVote
          isOpen={delegationDialog}
          delegate={delegationStatus}
          onClose={() => {
            setDelegationDialog(false);
            getDelegation();
          }}
        />
      )} */}
      <Drawer anchor="bottom" open={!!edit} onClose={boxClose} sx={{ overflowY: 'auto' }}>
        <BoxForms onClose={boxClose} onSubmit={boxUpdate} defaultValues={edit} />
      </Drawer>
    </Stack>
  );
};

export default IdeasBoxView;
