import { AppIcon, AppIconButton } from '@/components';
import MessageCard from '@/components/MessageCard';
import { MessageType } from '@/types/Scopes';
import { dashboardPhases, databaseRequest, localStorageGet, messageConsentValues, parseJwt } from '@/utils';
import { Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterBar from '../Settings/SettingsView/FilterBar';
import { useParams } from 'react-router-dom';
import { BoxesResponseType, IdeasResponseType } from '@/types/RequestTypes';
import { IdeaBox, IdeaBubble } from '@/components/IdeaComponents';

/**
 * Renders "Phase" view
 * url: /Phase/:phase
 */

const MessagesView = () => {
  const { t } = useTranslation();
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
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
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeasByUser',
      arguments: { user_id: jwt_payload.user_id },
    }).then((response) => setItems(response));

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
              <Grid key={item.id} item xs={12} sm={6} lg={4} xl={3} sx={{ scrollSnapAlign: 'center' }}>
                <IdeaBox box={item} onReload={itemsFetch} />
              </Grid>
            ) : (
              <Grid key={item.id} item xs={12} sm={6} lg={4} xl={3} sx={{ scrollSnapAlign: 'center' }}>
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
