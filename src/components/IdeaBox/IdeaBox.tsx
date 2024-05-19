import { CardMedia, Stack, Typography } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { phases } from '@/utils/phases';
import { BoxType } from '@/types/BoxTypes';

interface IdeaBoxProps {
  box: BoxType;
}

const displayPhases = Object.keys(Object.freeze(phases)) as Array<keyof typeof phases>;

const IdeaBox = ({ box }: IdeaBoxProps) => {
  return (
    <Card sx={{ borderRadius: '25px', scrollSnapAlign: 'center' }} variant="outlined">
      <CardContent>
        <Stack direction="row" mb={2} alignItems="center" spacing={2}>
          {displayPhases.map((phase, key) => {
            const isCurrentPhase = key === box.phase_id;
            return (
              <Stack
                className={isCurrentPhase ? "noVolume noSpace" : "noPrint"}
                width={isCurrentPhase ? 'auto' : '1.5em'}
                flexGrow={isCurrentPhase ? 1 : 0}
                height="1.5rem"
                borderRadius={999}
                bgcolor={phases[phase].color}
                alignItems="center"
                justifyContent="center"
                key={key}
              >
                <Typography variant="caption">{isCurrentPhase ? phases[phase].name : ''}</Typography>
              </Stack>
            );
          })}
        </Stack>
        <CardMedia
          component="img"
          height="194"
          image="/img/aula-room.png"
          alt="bg image"
          sx={{ borderRadius: '10px' }}
        />
        {/* { !noCategories &&
            <Stack direction="row" mt={3} alignItems="center">
              <CurrentIcon />
              <Typography>3</Typography>
              <Stack flexGrow={1} pr={1} direction="row" alignItems="center" justifyContent="flex-end">
                <Chip label="category" color="warning" />
              </Stack>
            </Stack>
          } */}
        <Typography variant="h6" sx={{ mt: 1.5 }} noWrap>
          {box.name}
        </Typography>
        <Typography sx={{ mt: 0.5, mb: -1 }} variant="body2" noWrap>
          {box.description_public}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default IdeaBox;
