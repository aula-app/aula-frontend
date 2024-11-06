import BoxCard from '@/components/BoxCard';
import { IdeaBubble } from '@/components/Idea';
import { BoxType, IdeaType } from '@/types/Scopes';
import { dashboardPhases, databaseRequest } from '@/utils';
import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DashBoard from '../DashBoard/DashBoard';

/**
 * Renders "Phase" view
 * url: /Phase/:phase
 */

const MessagesView = () => {
  const { t } = useTranslation();
  const params = useParams();
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
      for await (const ideas of response.data.map((topic) =>
        databaseRequest({
          model: 'Idea',
          method: 'getIdeasByTopic',
          arguments: {
            topic_id: topic.id,
          },
        })
      )) {
        setItems([...items, ...ideas.data]);
      }
    });
  };

  const ideasFetch = async () =>
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
    });

  useEffect(() => {
    setItems([]);
    //@ts-ignore
    params.phase === '0' ? ideasFetch() : boxesFetch();
  }, [params.phase]);
  return (
    <Stack p={2} sx={{ overflowY: 'auto' }}>
      <DashBoard show={true} />
      <Typography variant="h5" py={2}>
        {t(`phases.${dashboardPhases[params.phase || 'WildIdeas']}`)}
      </Typography>
      <Grid container spacing={2} p={1}>
        {items.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
            <IdeaBubble
              idea={item}
              onReload={ideasFetch}
              key={item.id}
              comments={item.sum_comments}
              to={`/room/${item.room_id}/phase/0/idea/${item.id}`}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default MessagesView;
