import { AppIcon, AppLink } from '@/components';
import BoxCard from '@/components/BoxCard';
import { MoveData } from '@/components/Data';
import DelegateVote from '@/components/DelegateVote';
import { IdeaCard } from '@/components/Idea';
import { DelegationType } from '@/types/Delegation';
import { IdeasResponseType, SingleBoxResponseType } from '@/types/RequestTypes';
import { checkPermissions, databaseRequest } from '@/utils';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
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
  const [box, setBox] = useState<SingleBoxResponseType>();
  const [boxIdeas, setBoxIdeas] = useState<IdeasResponseType>();
  const [delegationStatus, setDelegationStatus] = useState<DelegationType[]>();
  const [delegationDialog, setDelegationDialog] = useState(false);

  const boxFetch = async () =>
    await databaseRequest({
      model: 'Topic',
      method: 'getTopicBaseData',
      arguments: { topic_id: Number(params['box_id']) },
    }).then((response) => {
      setBox(response);
      if (response.data.phase_id === 30) getDelegation();
    });

  const boxIdeasFetch = async () =>
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeasByTopic',
      arguments: { topic_id: Number(params['box_id']) },
    }).then((response) => setBoxIdeas(response));

  const getDelegation = async () =>
    await databaseRequest(
      {
        model: 'User',
        method: 'getDelegationStatus',
        arguments: { topic_id: Number(params['box_id']) },
      },
      ['user_id']
    ).then((response) => setDelegationStatus(response.data));

  useEffect(() => {
    boxFetch();
    boxIdeasFetch();
    getDelegation();
  }, []);

  return (
    <>
      <Box
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
        {box && box.data && (
          <>
            <BoxCard box={box.data || {}} noLink onReload={boxFetch} />
            <Stack direction="row">
              <Typography variant="h6" p={2}>
                {boxIdeas &&
                  t(delegationStatus && delegationStatus.length > 0 ? `texts.delegated` : `texts.undelegated`, {
                    var: boxIdeas.count,
                  })}
              </Typography>
              {Number(box.data.phase_id) === 30 && (
                <Button
                  size="small"
                  sx={{ ml: 'auto', mt: 0.5, px: 1, bgcolor: '#fff', color: grey[600], borderRadius: 5 }}
                  onClick={() => setDelegationDialog(true)}
                >
                  <Typography variant="caption">or</Typography>
                  <Typography variant="caption" color="primary" fontWeight={700} sx={{ mx: 1 }}>
                    {delegationStatus && delegationStatus.length > 0
                      ? t('delegation.revoke')
                      : t('delegation.delegate')}
                  </Typography>
                  <AppIcon icon="delegate" size="small" />
                </Button>
              )}
            </Stack>
            {boxIdeas && (
              <>
                {checkPermissions(50) && (
                  <MoveData parentId={Number(params['box_id'])} scope="ideas" onClose={boxIdeasFetch} />
                )}
                <Grid container spacing={1} pt={1}>
                  {boxIdeas.data &&
                    boxIdeas.data.map((idea, key) => (
                      <Grid
                        key={key}
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        sx={{ scrollSnapAlign: 'center' }}
                        order={-idea.approved}
                      >
                        <AppLink to={`idea/${idea.id}`}>
                          <IdeaCard idea={idea} phase={box.data.phase_id} />
                        </AppLink>
                      </Grid>
                    ))}
                </Grid>
              </>
            )}
          </>
        )}
      </Box>
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
