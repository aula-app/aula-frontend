import { Badge, Box, Grid, Stack, Typography } from '@mui/material';
import AppIcon from '../AppIcon';
import { dashboardPhases } from '@/utils/phases';

const displayPhases = Object.keys(Object.freeze(dashboardPhases)) as Array<keyof typeof dashboardPhases>;

const DashBoard = ({ show = false }) => {
  return (
    <Box
      sx={{
        maxHeight: `${show ? 250 : 0}px`,
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
          <Typography variant="h4" sx={{ mr: 'auto', flexWrap: 'wrap' }}>
            Your Activity
          </Typography>
          <Badge badgeContent={2} color="primary" sx={{ mx: 1 }}>
            <AppIcon name="envelope" />
          </Badge>
          <Badge badgeContent={16} color="primary" sx={{ mx: 1 }}>
            <AppIcon name="heart" />
          </Badge>
        </Stack>
        <Grid container spacing={1} py={1}>
          {displayPhases.map((phase, key) => (
            <Grid item xs={6} key={key}>
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
                  {Math.floor(Math.random()*11)}
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
