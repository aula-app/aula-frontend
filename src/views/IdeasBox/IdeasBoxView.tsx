import { AppIcon, AppLink } from '@/components';
import BoxCard from '@/components/BoxCard';
import BoxCardSkeleton from '@/components/BoxCard/BoxCardSkeleton';
import { BoxForms } from '@/components/DataForms';
import { IdeaCard } from '@/components/Idea';
import IdeaCardSkeleton from '@/components/Idea/IdeaCard/IdeaCardSkeleton';
import KnowMore from '@/components/KnowMore';
import { deleteBox, editBox, EditBoxArguments, getBox, getBoxDelegation } from '@/services/boxes';
import { getIdeasByBox } from '@/services/ideas';
import { DelegationType } from '@/types/Delegation';
import { BoxType, IdeaType } from '@/types/Scopes';
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

  const boxIdeasFetch = async () => {
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeasByTopic',
      arguments: { topic_id: params['box_id'] },
    }).then((response) => {
      setLoading(false);
      if (!response.success || !response.data) return;
      const currentIdeas = (response.data as IdeaType[]).filter((idea) =>
        Number(params['phase']) >= 30 ? idea.approved > -1 : true
      ); // Filter out unapproved ideas
      setBoxIdeas(currentIdeas);
    });
  };

  const boxUpdate = async (data: EditBoxArguments) => {
    if (!(typeof edit === 'object') || !edit.topic_id) return;
    const request = await editBox(edit);
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
  //     if (!response.data || !response.data) return;
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
    <>
      <Stack
        height="100%"
        flexGrow={1}
        position="relative"
        px={1}
        py={2}
        sx={{
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
        }}
      >
        <BoxCard box={String(params['box_id'])} noLink />
        <Stack direction="row">
          <Typography variant="h6" p={2}>
            {t(
              delegationStatus && delegationStatus.length > 0
                ? `delegation.status.delegated`
                : `delegation.status.undelegated`,
              {
                var: boxIdeas.length,
              }
            )}
          </Typography>
          {Number(params['phase']) === 30 && (
            <Stack direction="row" position="relative" alignItems="center" sx={{ ml: 'auto', pr: 3 }}>
              <Button
                size="small"
                sx={{ mt: 0.75, bgcolor: '#fff', color: grey[600], borderRadius: 5 }}
                onClick={() => setDelegationDialog(true)}
              >
                <Typography variant="caption">{t('ui.common.or')}</Typography>
                <Typography variant="caption" color="primary" fontWeight={700} sx={{ mx: 1 }}>
                  {delegationStatus && delegationStatus.length > 0 ? t('delegation.revoke') : t('delegation.delegate')}
                </Typography>
              </Button>
              <KnowMore title={t('tooltips.delegate')}>
                <AppIcon icon="delegate" size="small" />
              </KnowMore>
            </Stack>
          )}
        </Stack>
        {checkPermissions(30) && String(params['phase']) === '10' && (
          <MoveData id={Number(params['box_id'])} scope="boxes" onClose={() => boxIdeasFetch()} />
        )}
        <Grid container spacing={1} pt={1} pb={2}>
          {isLoading && (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ scrollSnapAlign: 'center' }}>
              <IdeaCardSkeleton />
            </Grid>
          )}
          {boxIdeas.map((idea, key) => (
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
