import BoxCard from '@/components/BoxCard';
import { IdeaBubble } from '@/components/Idea';
import { BoxesResponseType, IdeasResponseType } from '@/types/RequestTypes';
import { dashboardPhases, databaseRequest } from '@/utils';
import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

/**
 * Renders "Phase" view
 * url: /Phase/:phase
 */

const MessagesView = () => {
  const { t } = useTranslation();
  const params = useParams();
  const [items, setItems] = useState<BoxesResponseType | IdeasResponseType>();

  const itemsFetch = async () =>
    await databaseRequest({
      model: 'Topic',
      method: 'getTopicsByPhase',
      arguments: {
        offset: 0,
        limit: 0,
        phase_id: Number(params.phase),
      },
    }).then((response) => setItems(response));

  const ideasFetch = async () =>
    await databaseRequest(
      {
        model: 'Idea',
        method: 'getWildIdeasByUser',
        arguments: {},
      },
      ['user_id']
    ).then((response) => setItems(response));

  useEffect(() => {
    //@ts-ignore
    params.phase === '0' ? ideasFetch() : itemsFetch();
  }, [params.phase]);
  return (
    <Stack p={2} sx={{ overflowY: 'auto' }}>
      <Typography variant="h5" py={2}>
        {t(`phases.${dashboardPhases[params.phase || 'WildIdeas'].name}`)}
      </Typography>
      <Grid container spacing={2} p={1}>
        {items &&
          items.data &&
          items.data.map((item) => {
            return 'phase_id' in item ? (
              <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
                <BoxCard box={item.id} onReload={itemsFetch} />
              </Grid>
            ) : (
              <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
                <IdeaBubble
                  idea={item}
                  onReload={ideasFetch}
                  key={item.id}
                  comments={item.sum_comments}
                  to={`/room/${item.room_id}/phase/0/idea/${item.id}`}
                />
              </Grid>
            );
          })}
      </Grid>
    </Stack>
  );
};

export default MessagesView;
