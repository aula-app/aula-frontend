import AppIcon from '@/components/AppIcon';
import { Card, Stack, Typography } from '@mui/material';

interface ApprovalCardProps {
  disabled?: boolean;
  rejected?: boolean;
  comment?: string | null;
}

/**
 * Renders "Welcome" view
 * url: /
 */
const ApprovalCard = ({ disabled = false, rejected = false, comment = 'No comment' }: ApprovalCardProps) => {
  return (
    <Card
      sx={{
        borderRadius: '25px',
        overflow: 'hidden',
        my: 2,
        py: 1,
        scrollSnapAlign: 'center',
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
          <AppIcon icon={rejected ? 'rejected' : 'approved'} />
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

export default ApprovalCard;
