import { Card, Stack, Typography } from '@mui/material';
import AppIcon from '../AppIcon';

interface IdeaBoxProps {
  disabled?: boolean;
  rejected?: boolean;
  comment?: string | null;
}

/**
 * Renders "Welcome" view
 * url: /
 */
const IdeaBox = ({ disabled = false, rejected = false, comment = 'No comment' }: IdeaBoxProps) => {
  return (
    <Card
      sx={{
        borderRadius: '25px',
        overflow: 'hidden',
        my: 2,
        py: 1,
        scrollSnapAlign: 'center',
        color: disabled ? 'disabled.main' : 'inherit',
        bgcolor: rejected || disabled ? 'disabled.main' : 'for.main',
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
          }}
          fontSize={40}
        >
          {!rejected ? <AppIcon icon="approved" /> : <AppIcon icon="rejected" />}
        </Stack>
        <Stack flexGrow={1} pr={2}>
          <Typography variant="body2" sx={{ color: 'inherit' }}>
            {comment || 'Approval text'}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default IdeaBox;
