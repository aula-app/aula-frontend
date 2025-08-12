import AppIcon from '@/components/AppIcon';
import { getDashboard } from '@/services/dashboard';
import { dashboardPhases } from '@/utils';
import { Box, Button, Collapse, Skeleton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const displayPhases = Object.keys(dashboardPhases) as Array<keyof typeof dashboardPhases>;

interface DashboardProps {
  show?: boolean;
}

const Dashboard = ({ show = true }: DashboardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [count, setCount] = useState<Record<number, number>>();
  const [isShowing, setShowing] = useState(show);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getDashboard();
      if (!response.error && response.data) {
        setCount(response.data.phase_counts);
      } else {
        setError(response.error || 'Failed to load dashboard');
      }
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setShowing(show);
  }, [show]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <Box component="section" aria-labelledby="dashboard-heading">
      <Stack
        sx={{
          p: 1,
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Stack direction="row" width="100%" pr={1} gap={1} sx={{ alignItems: 'center' }}>
          <Button
            onClick={() => setShowing(!isShowing)}
            sx={{ mr: 'auto', color: 'inherit', textTransform: 'none' }}
            aria-expanded={isShowing}
            aria-controls="dashboard-content"
            aria-label={isShowing ? t('actions.hide') : t('actions.show')}
          >
            <Typography
              variant="h2"
              sx={{ flexWrap: 'wrap', transition: 'opacity .5s ease-in-out' }}
              id="dashboard-heading"
              component="h2"
            >
              {t('ui.navigation.dashboard')}
            </Typography>
            <AppIcon
              icon="arrowdown"
              sx={{
                ml: 1,
                transform: `rotate(${isShowing ? '360deg' : '180deg'})`,
                transition: 'transform .2s ease-in-out',
              }}
              aria-hidden="true"
            />
          </Button>
        </Stack>
        <Collapse in={isShowing} sx={{ width: '100%' }} id="dashboard-content" role="region" aria-live="polite">
          <Grid container spacing={1} p={1} role="list" aria-label={t('ui.navigation.dashboard')}>
            {error && (
              <Grid size={12} role="alert">
                <Typography color="error" textAlign="center">
                  {t('errors.default')}
                </Typography>
              </Grid>
            )}
            {displayPhases.map((phase) => (
              <Grid size={{ xs: 6, sm: 3 }} key={phase} role="listitem">
                {count && dashboardPhases[phase] && !isLoading ? (
                  <Button
                    fullWidth
                    sx={{
                      py: 1,
                      px: 2,
                      backgroundColor: `${dashboardPhases[phase]}.main`,
                      borderRadius: '9999px',
                      textTransform: 'none',
                      color: 'inherit',
                      minHeight: '40.5px',
                      '&:hover': {
                        backgroundColor: `${dashboardPhases[phase]}.dark`,
                      },
                    }}
                    onClick={() => navigate(`/phase/${phase}`)}
                    aria-label={`${t(`phases.${dashboardPhases[phase]}`)} - ${count[Number(phase)]} ${t('ui.units.ideas')}`}
                  >
                    <Stack direction="row" alignItems="center" width="100%">
                      <AppIcon icon={dashboardPhases[phase]} aria-hidden="true" />
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
                      <Typography component="span">
                        {count[Number(phase)]}
                      </Typography>
                    </Stack>
                  </Button>
                ) : (
                  <Skeleton
                    variant="rectangular"
                    sx={{ borderRadius: '9999px', height: '40.5px' }}
                    aria-label={t('status.loading')}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </Stack>
    </Box>
  );
};

export default Dashboard;
