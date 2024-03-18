import { Stack, Typography } from '@mui/material';
import { Card } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Stars, DoNotDisturbOn } from '@mui/icons-material';
import { grey, yellow } from '@mui/material/colors';

interface IdeaBoxProps {
  disabled?: boolean;
  rejected?: boolean;
}

/**
 * Renders "Welcome" view
 * url: /
 */
const IdeaBox = ({ disabled = false, rejected = false }: IdeaBoxProps) => {
  //const CurrentIcon = phases.wild.icon;
  const params = useParams();

  return (
    <Card
      sx={{
        borderRadius: '25px',
        overflow: 'hidden',
        my: 2,
        scrollSnapAlign: 'center',
        bgcolor: disabled ? grey[200] : '#fff',
      }}
      variant="outlined"
    >
      <Stack direction="row" alignItems="center">
        <Stack
          height="75px"
          alignItems="center"
          justifyContent="center"
          sx={{
            aspectRatio: 1,
            color: disabled ? grey[500] : yellow[600],
          }}
        >
          {!rejected ? <Stars fontSize="large" /> : <DoNotDisturbOn fontSize="large" />}
        </Stack>
        <Stack flexGrow={1} pr={2}>
          <Typography variant="body2" sx={{ color: disabled ? grey[500] : 'inherit' }}>
            description lalalalalalalalalalalalallalaal
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default IdeaBox;
