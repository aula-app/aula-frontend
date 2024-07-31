import { dashboardPhases, databaseRequest, localStorageGet, parseJwt } from '@/utils';
import { Badge, Box, Button, Collapse, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIcon from '../AppIcon';
import AppIconButton from '../AppIconButton';

const displayPhases = Object.keys(dashboardPhases) as Array<keyof typeof dashboardPhases>;

const DashBoard = ({ show = true }) => {
  const { t } = useTranslation();
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const [count, setCount] = useState<Record<number, number>>({});
  const [reports, setReports] = useState(0);
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
    dashboardFetch('Idea', 'getDashboardByUser', ['user_id']).then((response) => {
      if (response && response.success) setCount(response.data.phase_counts);
    });
    dashboardFetch('Text', 'getTexts', []).then((response) => {
      if (response && response.success) setMessages(response.count);
    });
    dashboardFetch(
      'Message',
      jwt_payload.user_level >= 40 ? 'getMessages' : 'getMessagesByUser',
      jwt_payload.user_level >= 40 ? [] : ['user_id']
    ).then((response) => {
      if (response && response.success) setReports(response.count);
    });
    dashboardFetch('Idea', 'getUpdatesByUser', ['user_id']).then((response) => {
      if (response && response.success) setLikes(response.count);
    });
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
        <Stack direction="row" width="100%" pr={1} sx={{ alignItems: 'center' }}>
          <Button onClick={() => setShowing(!isShowing)} sx={{ mr: 'auto', color: 'inherit', textTransform: 'none' }}>
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
          </Button>
          <Badge badgeContent={messages + reports} color="primary" sx={{ mx: 1 }}>
            <AppIconButton icon="message" to="/messages" sx={{ p: 0 }} />
          </Badge>
          <Badge badgeContent={likes} color="primary" sx={{ mx: 1 }}>
            <AppIconButton icon="heart" to="/updates" sx={{ p: 0 }} />
          </Badge>
        </Stack>
        <Collapse in={isShowing} sx={{ width: '100%' }}>
          {count && Object.keys(count).length > 4 && (
            <Grid container spacing={1} p={1}>
              {displayPhases.map((phase, key) => (
                <Grid item xs={6} sm={3} key={key}>
                  <Box
                    sx={{
                      py: 1,
                      px: 2,
                      backgroundColor: `${dashboardPhases[phase].name}.main`,
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
