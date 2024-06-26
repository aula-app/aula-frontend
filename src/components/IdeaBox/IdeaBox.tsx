import { Box, Stack, Typography } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { phases } from '@/utils';
import { BoxType } from '@/types/BoxTypes';
import AppIcon from '../AppIcon';

interface IdeaBoxProps {
  box: BoxType;
}

const IdeaBox = ({ box }: IdeaBoxProps) => {
  return (
    <Card sx={{ borderRadius: '25px', scrollSnapAlign: 'center' }} variant="outlined">
      <Stack
        width="100%"
        height="3rem"
        alignItems="center"
        direction="row"
        bgcolor={phases[box.phase_id].color}
        p={1}
        pr={2}
      >
        <Stack
          bgcolor="#fff"
          borderRadius={999}
          height="100%"
          sx={{ aspectRatio: 1 }}
          justifyContent="center"
          alignItems="center"
          mr="auto"
        >
          <AppIcon icon="box" />
        </Stack>
        <AppIcon icon={phases[box.phase_id].icon} size="small" sx={{ mx: 1 }} />
        <Typography variant="caption">{phases[box.phase_id].name} phase</Typography>
      </Stack>
      <CardContent>
        <Typography variant="h6" noWrap>
          {box.name}
        </Typography>
        <Typography variant="body2">
          {box.description_public}
        </Typography>
        <Box
          mt={2}
          position="relative"
          borderRadius={999}
          width="100%"
          height="1.5rem"
          bgcolor={phases[box.phase_id].color}
          overflow="clip"
        >
          <Box bgcolor={phases[box.phase_id].baseColor[300]} position="absolute" left={0} height="100%" width="50%" />
          <Stack
            direction="row"
            position="absolute"
            left={0}
            height="100%"
            width="100%"
            alignItems="center"
            justifyContent="end"
            px={2}
          >
            <AppIcon icon="clock" size="small" sx={{ mx: .5 }} />
            <Typography variant="caption">Phase ends in 3 days</Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default IdeaBox;
