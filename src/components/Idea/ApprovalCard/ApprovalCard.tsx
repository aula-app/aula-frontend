import AppIcon from '@/components/AppIcon';
import { IconType } from '@/components/AppIcon/AppIcon';
import { IdeaType } from '@/types/Scopes';
import { Card, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ApprovalCardProps {
  idea: IdeaType;
  disabled?: boolean;
}

/**
 * Renders "Welcome" view
 * url: /
 */

const ApprovalCard = ({ idea, disabled = false }: ApprovalCardProps) => {
  const { t } = useTranslation();

  const approvalMessages = ['rejected', 'waiting', 'approved'] as IconType[];
  const approvalColors = ['against.main', 'approval.main', 'for.main'];

  return (
    <Card
      sx={{
        borderRadius: '25px',
        overflow: 'hidden',
        my: 2,
        py: 1,
        scrollSnapAlign: 'center',
        bgcolor: disabled ? 'disabled.main' : approvalColors[idea.approved + 1],
      }}
      variant="outlined"
    >
      <Stack height="75px" direction="row" alignItems="center" p={2} gap={2}>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            aspectRatio: 1,
          }}
          fontSize={40}
        >
          <AppIcon icon={approvalMessages[idea.approved + 1]} />
        </Stack>
        <Stack flexGrow={1}>
          <Typography variant="body2" sx={{ color: 'inherit' }}>
            {idea.approval_comment || t(`scopes.ideas.${approvalMessages[idea.approved + 1]}`)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default ApprovalCard;
