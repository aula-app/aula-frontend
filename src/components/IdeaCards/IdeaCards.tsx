import { Stack, Typography } from '@mui/material';
import { Card } from '@mui/material';
import { AppLink } from '..';
import phases from '../../utils/phases';
import { useParams } from 'react-router-dom';

interface IdeaBoxProps {
  noCategories?: boolean;
}

const displayPhases = Object.keys(Object.freeze(phases)) as Array<keyof typeof phases>;
if (displayPhases.includes('success')) displayPhases.splice(displayPhases.indexOf('success'), 1);
if (displayPhases.includes('reject')) displayPhases.splice(displayPhases.indexOf('reject'), 1);
if (displayPhases.includes('wild')) displayPhases.splice(displayPhases.indexOf('wild'), 1);
/**
 * Renders "Welcome" view
 * url: /
 */
const IdeaBox = ({ noCategories = false }: IdeaBoxProps) => {
  //const CurrentIcon = phases.wild.icon;
  const params = useParams();

  return (
    <Card sx={{ borderRadius: '25px', overflow: 'hidden' }} variant="outlined">
      <AppLink to={`/room/${params.room_id}/idea-box/x`}>
        <Stack direction="row" height={68} alignItems="center">
          <Stack
            height="100%"
            alignItems="center"
            justifyContent="center"
            sx={{ aspectRatio: 1, borderRight: '1px solid #ccc' }}
          >
            x
          </Stack>
          <Stack flexGrow={1} px={2} overflow="hidden">
            <Typography variant="h6">TITLE</Typography>
            <Typography variant="body2" noWrap textOverflow="ellipsis">
              description lalalalalalalalalalalalallalaal
            </Typography>
          </Stack>
        </Stack>
      </AppLink>
    </Card>
  );
};

export default IdeaBox;
