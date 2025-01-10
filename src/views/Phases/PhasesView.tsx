import { IdeaBubble } from '@/components/Idea';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import { BoxType, IdeaType } from '@/types/Scopes';
import { dashboardPhases, databaseRequest } from '@/utils';
import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DashBoard from '../DashBoard';

/**
 * Renders "Phase" view
 * url: /Phase/:phase
 */

const MessagesView = () => {
  const { t } = useTranslation();
  const params = useParams();
  const [isLoading, setLoading] = useState(true);
  const [items, setItems] = useState<IdeaType[]>([]);

  const boxesFetch = async () => {
    await databaseRequest({
      model: 'Topic',
      method: 'getTopicsByPhase',
      arguments: {
        offset: 0,
        limit: 0,
        phase_id: Number(params.phase),
      },
    }).then(async (response: { success: boolean; count: number; data: BoxType[] }) => {
      if (!response.success || !response.data) return;
      boxIdeasFetch(response.data).then((items) => setItems(items));
      setLoading(false);
    });
  };

  async function boxIdeasFetch(boxes: BoxType[]): Promise<IdeaType[]> {
    // Use Promise.all to await all fetches
    const results = await Promise.all(
      boxes.map(async (box) => {
        const response = await databaseRequest({
          model: 'Idea',
          method: 'getIdeasByTopic',
          arguments: {
            topic_id: box.id,
          },
        });
        if (!response.success || !response.data) return;
        return response.data;
      })
    );
    return results.flat();
  }

  const wildIdeasFetch = async () =>
    await databaseRequest(
      {
        model: 'Idea',
        method: 'getWildIdeasByUser',
        arguments: {},
      },
      ['user_id']
    ).then((response) => {
      if (!response.success || !response.data) return;
      setItems(response.data as IdeaType[]);
      setLoading(false);
    });

  const ideasFetch = () => {
    params.phase === '0' ? wildIdeasFetch() : boxesFetch();
  };

  useEffect(() => {
    setLoading(true);
    ideasFetch();
  }, [params.phase]);
  return (
    <Stack p={2} sx={{ overflowY: 'auto' }}>
      <DashBoard show={true} />
      <Typography variant="h5" py={2}>
        {t(`phases.${dashboardPhases[params.phase || 'WildIdeas']}`)}
      </Typography>
      <Grid container spacing={2} p={1}>
        {isLoading && (
          <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
            <IdeaBubbleSkeleton />
          </Grid>
        )}
        {items.map((item) => (
          <Grid key={item.hash_id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
            <IdeaBubble
              idea={item}
              onReload={ideasFetch}
              key={item.hash_id}
              to={`/room/${item.room_hash_id}/phase/${params.phase}/idea/${item.hash_id}`}
              comments={item.sum_comments}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default MessagesView;
