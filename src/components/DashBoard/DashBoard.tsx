import { dashboardPhases, databaseRequest } from '@/utils';
import { Badge, Box, Collapse, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIcon from '../AppIcon';
import AppIconButton from '../AppIconButton';

const displayPhases = Object.keys(dashboardPhases) as Array<keyof typeof dashboardPhases>;

const DashBoard = ({ show = true }) => {
  const { t } = useTranslation();
  const [count, setCount] = useState<Record<number, number>>({});
  const [messages, setMessages] = useState(0);
  const [likes, setLikes] = useState(0);
  const [isShowing, setShowing] = useState(show);

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
    setShowing(show);
  }, [show]);

  useEffect(() => {
    dashboardFetch('Idea', 'getDashboardByUser', ['user_id']).then((response) => setCount(response.data.phase_counts));
    dashboardFetch('Text', 'getTexts', []).then((response) => setMessages(response.count));
    dashboardFetch('Text', 'getTexts', []).then((response) => setLikes(response.count));
  }, []);

  return (
    <Box>
      <Stack
        sx={{
          p: 1,
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Stack direction="row" width="100%" sx={{ alignItems: 'center' }}>
          <IconButton onClick={() => setShowing(!isShowing)} sx={{ mr: 'auto', color: 'inherit' }}>
            <Typography variant="h5" sx={{ flexWrap: 'wrap', transition: 'opacity .5s ease-in-out' }}>
              {t('views.dashboard')}
            </Typography>
            <AppIcon
              icon="arrowdown"
              sx={{
                ml: 1,
                transform: `rotate(${isShowing ? '360deg' : '180deg'})`,
                transition: 'transform .2s ease-in-out',
              }}
            />
          </IconButton>
          <Badge badgeContent={messages} color="primary" sx={{ mx: 1 }}>
            <AppIconButton icon="message" to="/messages" sx={{ p: 0 }} />
          </Badge>
          <Badge badgeContent={likes} color="primary" sx={{ mx: 1 }}>
            <AppIconButton icon="heart" to="/updates" sx={{ p: 0 }} />
          </Badge>
        </Stack>
        <Collapse in={isShowing}>
          {Object.keys(count).length > 4 && (
            <Grid container spacing={1} p={1}>
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
                      <AppIcon icon={dashboardPhases[phase].name} />
                      <Box
                        flexGrow={1}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        textAlign="left"
                        pl={1}
                      >
                        {t(`phases.${dashboardPhases[phase].name}`)}
                      </Box>
                      {count[Number(phase)]}
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Collapse>
      </Stack>
    </Box>
  );
};

export default DashBoard;
