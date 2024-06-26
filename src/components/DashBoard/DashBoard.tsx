import { Badge, Box, Grid, Stack, Typography } from '@mui/material';
import AppIcon from '../AppIcon';
import { dashboardPhases, databaseRequest, localStorageGet, parseJwt } from '@/utils';
import { useEffect, useState } from 'react';
import { ObjectPropByName } from '@/types/Generics';
import AppIconButton from '../AppIconButton';

const displayPhases = Object.keys(Object.freeze(dashboardPhases)) as Array<keyof typeof dashboardPhases>;

const DashBoard = ({ show = false }) => {
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);

  const [count, setCount] = useState<Record<number, number>>({});
  const [messages, setMessages] = useState(0);
  const [likes, setLikes] = useState(0);

  const dashboardFetch = async (model: string, method: string, args?: ObjectPropByName) =>
    await databaseRequest('model', {
      model: model,
      method: method,
      arguments: args,
    });

  useEffect(() => {
    dashboardFetch('Idea', 'getDashboardByUser', {user_id: jwt_payload.user_id}).then((response) => setCount(response.data.phase_counts));
    dashboardFetch('Text', 'getTexts').then((response) => setMessages(response.count));
    dashboardFetch('Text', 'getTexts').then((response) => setLikes(response.count));
  }, []);

  return (
    <Box
      sx={{
        maxHeight: `${show ? 15 : 3.75}rem`,
        overflow: 'clip',
        transition: 'all .5s ease-in-out',
      }}
    >
      <Stack
        sx={{
          p: 2,
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Stack direction="row" width="100%" sx={{ alignItems: 'center' }}>
          <Typography
            variant="h4"
            sx={{ mr: 'auto', flexWrap: 'wrap', opacity: `${show ? 100 : 0}%`, transition: 'opacity .5s ease-in-out' }}
          >
            Your Activity
          </Typography>
          <Badge badgeContent={messages} color="primary" sx={{ mx: 1 }}>
            <AppIconButton icon="message" to='/messages' sx={{p: 0}} />
          </Badge>
          <Badge badgeContent={likes} color="primary" sx={{ mx: 1 }}>
            <AppIconButton icon="heart" sx={{p: 0}} />
          </Badge>
        </Stack>
        {Object.keys(count).length > 6 && (
          <Grid
            container
            spacing={1}
            py={1}
            sx={{ opacity: `${show ? 100 : 0}%`, transition: 'opacity .5s ease-in-out' }}
          >
            {displayPhases.map((phase, key) => (
              <Grid item xs={6} sm={4} md={2} key={key}>
                <Box
                  sx={{
                    py: 1,
                    px: 2,
                    backgroundColor: dashboardPhases[phase].color,
                    borderRadius: 9999,
                    textTransform: 'none',
                  }}
                >
                  <Stack direction="row" alignItems="center" width="100%">
                    <AppIcon name={dashboardPhases[phase].icon} />
                    <Box
                      flexGrow={1}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      textAlign="left"
                      pl={1}
                    >
                      {dashboardPhases[phase].name}
                    </Box>
                    {count[Number(phase)]}
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
};

export default DashBoard;
