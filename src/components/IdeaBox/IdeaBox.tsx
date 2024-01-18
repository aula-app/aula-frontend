import { CardMedia, Chip, Stack, Typography } from '@mui/material';
import { Card, CardContent } from '@mui/material';
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

const IdeaBox = ({noCategories = false}: IdeaBoxProps) => {
  const CurrentIcon = phases.wild.icon;
  const params = useParams();

  return (
    <Card sx={{ borderRadius: '25px' }} variant="outlined">
      <CardContent>
        <Stack direction="row" mb={2} alignItems="center" spacing={2}>
          {displayPhases.map((phase, key) => (
            <Stack
              width={key === 0 ? 'auto' : '1.5em'}
              flexGrow={key === 0 ? 1 : 0}
              height="1.5rem"
              borderRadius={999}
              bgcolor={phases[phase].color}
              alignItems="center"
              justifyContent="center"
              key={key}
            >
              <Typography variant="caption">{key === 0 ? phases[phase].name : ''}</Typography>
            </Stack>
          ))}
        </Stack>
        <AppLink to={`/room/${params.room_id}/idea-box/x`}>
          <CardMedia
            component="img"
            height="194"
            image="/img/aula-room.png"
            alt="bg image"
            sx={{ borderRadius: '10px' }}
          />
          { !noCategories &&
            <Stack direction="row" mt={3} alignItems="center">
              <CurrentIcon />
              <Typography>3</Typography>
              <Stack flexGrow={1} pr={1} direction="row" alignItems="center" justifyContent="flex-end">
                <Chip label="category" color="warning" />
              </Stack>
            </Stack>
          }
          <Typography variant="h6" sx={{ mt: 1.5 }} noWrap>
            Room Name
          </Typography>
          <Typography sx={{ mt: 0.5, mb: -1 }} variant="body2" noWrap>
            description
          </Typography>
        </AppLink>
      </CardContent>
    </Card>
  );
};

export default IdeaBox;
