import { AppIcon, AppLink } from '@/components';
import BoxCard from '@/components/BoxCard';
import { MoveData } from '@/components/Data';
import EditData from '@/components/Data/EditData';
import DelegateVote from '@/components/DelegateVote';
import { IdeaCard } from '@/components/Idea';
import KnowMore from '@/components/KnowMore';
import { DelegationType } from '@/types/Delegation';
import { IdeasResponseType } from '@/types/RequestTypes';
import { RoomPhases } from '@/types/SettingsTypes';
import { checkPermissions, databaseRequest } from '@/utils';
import { Button, Fab, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

/** * Renders "IdeasBox" view
 * url: /room/:room_id/ideas-box/:box_id
 */
const IdeasBoxView = () => {
  const { t } = useTranslation();
  const params = useParams();
  const [add, setAdd] = useState(false);
  const [boxIdeas, setBoxIdeas] = useState<IdeasResponseType>();
  const [delegationStatus, setDelegationStatus] = useState<DelegationType[]>();
  const [delegationDialog, setDelegationDialog] = useState(false);

  const boxIdeasFetch = async () => {
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeasByTopic',
      arguments: { topic_id: Number(params['box_id']) },
    }).then((response) => {
      if (response.success) setBoxIdeas(response);
    });
  };

  const getDelegation = async () =>
    await databaseRequest(
      {
        model: 'User',
        method: 'getDelegationStatus',
        arguments: { topic_id: Number(params['box_id']) },
      },
      ['user_id']
    ).then((response) => {
      if (response.success) setDelegationStatus(response.data);
    });

  const closeAdd = () => {
    boxIdeasFetch();
    setAdd(false);
  };

  useEffect(() => {
    boxIdeasFetch();
    getDelegation();
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
        <BoxCard box={Number(params['box_id'])} noLink />
        <Stack direction="row">
          <Typography variant="h6" p={2}>
            {boxIdeas &&
              t(delegationStatus && delegationStatus.length > 0 ? `texts.delegated` : `texts.undelegated`, {
                var: boxIdeas.count,
              })}
          </Typography>
          {Number(params['phase']) === 30 && (
            <Button
              size="small"
              sx={{ ml: 'auto', mt: 0.5, px: 1, bgcolor: '#fff', color: grey[600], borderRadius: 5 }}
              onClick={() => setDelegationDialog(true)}
            >
              <Typography variant="caption">{t('generics.or')}</Typography>
              <Typography variant="caption" color="primary" fontWeight={700} sx={{ mx: 1 }}>
                {delegationStatus && delegationStatus.length > 0 ? t('delegation.revoke') : t('delegation.delegate')}
              </Typography>
              <KnowMore title={t('tooltips.delegate')}>
                <AppIcon icon="delegate" size="small" />
              </KnowMore>
            </Button>
          )}
        </Stack>
        {boxIdeas && (
          <>
            {checkPermissions(30) && (
              <MoveData id={Number(params['box_id'])} scope="boxes" onClose={() => boxIdeasFetch()} />
            )}
            <Grid container spacing={1} pt={1} pb={2}>
              {boxIdeas.data &&
                boxIdeas.data.map((idea, key) => (
                  <Grid
                    key={key}
                    size={{ xs: 12, sm: 6, md: 4 }}
                    sx={{ scrollSnapAlign: 'center' }}
                    order={-idea.approved}
                  >
                    <AppLink to={`idea/${idea.id}`}>
                      <IdeaCard idea={idea} phase={Number(params['phase']) as RoomPhases} />
                    </AppLink>
                  </Grid>
                ))}
            </Grid>
          </>
        )}
        {checkPermissions(20) && String(params['phase']) === '10' && (
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
      )}
    </>
  );
};

export default IdeasBoxView;
