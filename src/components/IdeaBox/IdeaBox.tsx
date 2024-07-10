import { Box, Stack, Typography } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { phases } from '@/utils';
import { BoxType } from '@/types/scopes/BoxTypes';
import AppIcon from '../AppIcon';
import MoreOptions from '../MoreOptions';
import AppLink from '../AppLink';
import { useParams } from 'react-router-dom';

interface IdeaBoxProps {
  box: BoxType;
  noLink?: boolean;
  onReload: () => void;
}

const IdeaBox = ({ box, noLink = false, onReload }: IdeaBoxProps) => {
  const params = useParams();

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
        <AppIcon icon={phases[box.phase_id].icon} size='large' sx={{ mr: 1 }} />
        <Typography variant="caption" mr="auto">{phases[box.phase_id].name} phase</Typography>
        <MoreOptions element='boxes' id={box.id} onClose={onReload} />
      </Stack>
      <AppLink to={`idea-box/${box.id}`} mb={2} key={box.id} disabled={noLink}>
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
      </AppLink>
    </Card>
  );
};

export default IdeaBox;
