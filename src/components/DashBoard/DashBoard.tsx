import { Badge, Box, Button, Fade, Grid, Stack, Typography } from '@mui/material';
import AppIcon from '../AppIcon';
import { dashboardPhases } from '@/utils/phases';

interface Props {
  show: boolean
}

const displayPhases = Object.keys(Object.freeze(dashboardPhases)) as Array<keyof typeof dashboardPhases>;

const DashBoard = ({ show }: Props) => {
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
          <Fade in={show}>
            <Typography variant="h4" sx={{ mr: 'auto', flexWrap: 'wrap', transition: 'opacity .5s ease-in-out' }}>
              Your Activity
            </Typography>
          </Fade>
          <Fade in={!show}>
            <Button color="secondary" sx={{ position: 'absolute', mt: -1, flex: 1 }}>
              <AppIcon name="arrowdown" />
            </Button>
          </Fade>
          <Badge badgeContent={2} color="primary" sx={{ mx: 1 }}>
            <AppIcon name="envelope" />
          </Badge>
          <Badge badgeContent={likes} color="primary" sx={{ mx: 1 }}>
            <AppIconButton icon="heart" sx={{p: 0}} />
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
      </Stack>
    </Box>
  );
};

export default DashBoard;
