import { Stack, Typography } from '@mui/material';
import { Card } from '@mui/material';
import { useParams } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { variantOptions } from '@/utils';

interface IdeaBoxProps {
  disabled?: boolean;
  rejected?: boolean;
  comment?: string | null;
}

/**
 * Renders "Welcome" view
 * url: /
 */
const IdeaBox = ({ disabled = false, rejected = false, comment = 'No comment'}: IdeaBoxProps) => {
  const params = useParams();

  return (
    <Card
      sx={{
        borderRadius: '25px',
        overflow: 'hidden',
        my: 2,
        scrollSnapAlign: 'center',
        color: !disabled && !rejected ? variantOptions.approved.color : variantOptions.dismissed.color,
        bgcolor: !disabled && !rejected ? variantOptions.approved.bg : variantOptions.dismissed.bg,
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
          {!rejected ? variantOptions.approved.icon : variantOptions.dismissed.icon}
        </Stack>
        <Stack flexGrow={1} pr={2}>
          <Typography variant="body2" sx={{ color: disabled ? grey[500] : 'inherit' }}>
            {comment}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default IdeaBox;
