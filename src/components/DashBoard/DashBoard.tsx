import { Badge, Box, Grid, Stack, Typography } from '@mui/material';
import AppIcon from '../AppIcon';
import { dashboardPhases, databaseRequest } from '@/utils';
import { useEffect, useState } from 'react';
import AppIconButton from '../AppIconButton';

const displayPhases = Object.keys(dashboardPhases) as Array<keyof typeof dashboardPhases>;

const DashBoard = ({ show = false }) => {
  const [count, setCount] = useState<Record<number, number>>({});
  const [messages, setMessages] = useState(0);
  const [likes, setLikes] = useState(0);

  const dashboardFetch = async (model: string, method: string, idRequest: string[]) =>
    await databaseRequest(
      {
        model: model,
        method: method,
        arguments: {},
      },
      idRequest
    );

  useEffect(() => {
    dashboardFetch('Idea', 'getDashboardByUser', ['user_id']).then((response) => setCount(response.data.phase_counts));
    dashboardFetch('Text', 'getTexts', []).then((response) => setMessages(response.count));
    dashboardFetch('Text', 'getTexts', []).then((response) => setLikes(response.count));
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
            <AppIconButton icon="message" to="/messages" sx={{ p: 0 }} />
          </Badge>
          <Badge badgeContent={likes} color="primary" sx={{ mx: 1 }}>
            <AppIconButton icon="heart" sx={{ p: 0 }} />
          </Badge>
        </Stack>
        {Object.keys(count).length > 4 && (
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
