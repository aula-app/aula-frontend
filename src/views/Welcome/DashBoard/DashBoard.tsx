import AppIcon from '@/components/AppIcon';
import AppIconButton from '@/components/AppIconButton';
import { getDashboard, getUpdates } from '@/services/dashboard';
import { getMessages } from '@/services/messages';
import { getAnnouncements } from '@/services/announcements';
import { dashboardPhases } from '@/utils';
import { Badge, Box, Button, Collapse, Skeleton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const displayPhases = Object.keys(dashboardPhases) as Array<keyof typeof dashboardPhases>;

const DashBoard = ({ show = true }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [count, setCount] = useState<Record<number, number>>();
  const [reports, setReports] = useState<number>();
  const [messages, setMessages] = useState<number>();
  const [likes, setLikes] = useState<number>();
  const [isShowing, setShowing] = useState(show);

  const fetchDashboard = async () => {
    const response = await getDashboard();
    if (!response.error && response.data) setCount(response.data.phase_counts);
  };
  const fetchUpdates = async () => {
    const response = await getUpdates();
    if (!response.error && typeof response.count === 'number') setLikes(response.count);
  };
  const fetchMessages = async () => {
    const response = await getMessages();
    if (!response.error) setMessages(response.data?.length || 0);
  };
  const fetchTexts = async () => {
    const response = await getAnnouncements({
      offset: 0,
      limit: 0,
    });
    if (!response.error) setReports(response.data?.length || 0);
  };

  useEffect(() => {
    setShowing(show);
  }, [show]);

  useEffect(() => {
    fetchDashboard();
    fetchUpdates();
    fetchMessages();
    fetchTexts();
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
        <Stack direction="row" width="100%" pr={1} gap={1} sx={{ alignItems: 'center' }}>
          <Button onClick={() => setShowing(!isShowing)} sx={{ mr: 'auto', color: 'inherit', textTransform: 'none' }}>
            <Typography variant="h2" sx={{ flexWrap: 'wrap', transition: 'opacity .5s ease-in-out' }}>
              {t('ui.navigation.dashboard')}
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
          {typeof messages === 'number' && typeof reports === 'number' ? (
            <Badge badgeContent={messages + reports} color="primary">
              <AppIconButton icon="message" to="/messages" sx={{ p: 0 }} />
            </Badge>
          ) : (
            <Skeleton variant="circular" sx={{ width: 20, aspectRatio: 1, mx: 1 }} />
          )}
          {typeof likes === 'number' ? (
            <Badge badgeContent={likes} color="primary" sx={{ mx: 1 }}>
              <AppIconButton icon="heart" to="/updates" sx={{ p: 0 }} />
            </Badge>
          ) : (
            <Skeleton variant="circular" sx={{ width: 20, aspectRatio: 1, mx: 1 }} />
          )}
        </Stack>
        <Collapse in={isShowing} sx={{ width: '100%' }}>
          <Grid container spacing={1} p={1}>
            {displayPhases.map((phase, key) => (
              <Grid size={{ xs: 6, sm: 3 }} key={key}>
                {count && dashboardPhases[phase] ? (
                  <Button
                    fullWidth
                    sx={{
                      py: 1,
                      px: 2,
                      backgroundColor: `${dashboardPhases[phase]}.main`,
                      borderRadius: 9999,
                      textTransform: 'none',
                      color: 'inherit',
                      '&:hover': {
                        backgroundColor: `${dashboardPhases[phase]}.dark`,
                      },
                    }}
                    onClick={() => navigate(`/phase/${phase}`)}
                  >
                    <Stack direction="row" alignItems="center" width="100%">
                      <AppIcon icon={dashboardPhases[phase]} />
                      <Typography
                        flexGrow={1}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        textAlign="left"
                        pl={1}
                      >
                        {t(`phases.${dashboardPhases[phase]}`)}
                      </Typography>
                      {count[Number(phase)]}
                    </Stack>
                  </Button>
                ) : (
                  <Skeleton variant="rectangular" sx={{ borderRadius: 9999, height: 40.5 }} />
                )}
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </Stack>
    </Box>
  );
};

export default DashBoard;
