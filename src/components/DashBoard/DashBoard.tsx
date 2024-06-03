import { Badge, Box, Grid, IconButton, Stack, Typography } from '@mui/material';
import AppIcon from '../AppIcon';
import { dashboardPhases } from '@/utils/phases';
import { useNavigate } from 'react-router-dom';

const displayPhases = Object.keys(Object.freeze(dashboardPhases)) as Array<keyof typeof dashboardPhases>;

const DashBoard = ({ show = false }) => {
  const navigate = useNavigate();
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
          <Badge badgeContent={2} color="primary">
            <IconButton onClick={() => navigate('/messages')}>
              <AppIcon name="envelope" />
            </IconButton>
          </Badge>
          <Badge badgeContent={16} color="primary" sx={{ mx: 1 }}>
            <IconButton>
              <AppIcon name="heart" />
            </IconButton>
          </Badge>
        </Stack>
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
                  color: '#000',
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
                  {Math.floor(Math.random() * 11)}
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
        {/* <Box position="absolute" bottom={0} width="100%" bgcolor={blueGrey[50]}>
        <Button sx={{ width: '100%', py: 1 }} onClick={toggleNotifications} {...handlers}>
          <Divider sx={{ width: '50%' }} variant="middle" />
        </Button>
      </Box> */}
      </Stack>
    </Box>
  );
};

export default DashBoard;
