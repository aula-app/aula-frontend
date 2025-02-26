import AppIcon from '@/components/AppIcon';
import { IconType } from '@/components/AppIcon/AppIcon';
import AppIconButton from '@/components/AppIconButton';
import { MarkdownEditor } from '@/components/DataFields';
import ApproveField from '@/components/DataFields/ApproveField';
import MarkdownReader from '@/components/MarkdownReader';
import { setApprovalStatus } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { PhaseType, RoomPhases } from '@/types/SettingsTypes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

interface ApprovalCardProps {
  idea: IdeaType;
  phase: number;
  disabled?: boolean;
  onReload: () => void;
}

/**
 * Renders "Welcome" view
 * url: /
 */

const ApprovalCard = ({ idea, phase, disabled = false, onReload }: ApprovalCardProps) => {
  const { t } = useTranslation();

  const approvalMessages = ['rejected', 'waiting', 'approved'] as IconType[];
  const approvalColors = ['against.main', 'disabled.main', 'for.main'];

  const [isLoading, setLoading] = useState(false);

  const schema = yup.object({
    approved: yup.number().required(t('forms.validation.required')),
    approval_comment: yup.string().when('approved', {
      is: (val: number | undefined): val is number => val === -1,
      then: (schema) => schema.required(t('forms.validation.required')),
    }),
  });

  const { reset, control, handleSubmit, setError, getValues, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { approved: idea.approved || 0, approval_comment: idea.approval_comment || '' },
  });
  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const [isEditing, setEditing] = useState(getValues('approved') === 0);

  const onSubmit = async (data: SchemaType) => {
    if (data.approved === 0) {
      setError('approved', { message: t('forms.validation.required') });
      return;
    }
    setLoading(true);

    await setApprovalStatus({
      idea_id: idea.hash_id,
      approved: data.approved,
      approval_comment: data.approval_comment || '',
    });
    setLoading(false);
    setEditing(false);
    onReload();

    if (phase == 40) {
      const result = await setWinning(data.approved != -1, idea.hash_id);
    }
  };

  const onClose = () => {
    if (watch('approved') !== 0) setEditing(false);
    reset({ approved: idea.approved || 0, approval_comment: idea.approval_comment || '' });
  };

  useEffect(() => {
    reset({ approved: idea.approved || 0, approval_comment: idea.approval_comment || '' });
  }, [idea]);

  return (
    (phase == 20 || (phase == 40 && !!checkPermissions('ideas', 'setWinner'))) && (
      <Card
        sx={{
          borderRadius: '25px',
          overflow: 'hidden',
          scrollSnapAlign: 'center',
          bgcolor: disabled ? 'disabled.main' : approvalColors[(watch('approved') ?? idea.approved) + 1],
        }}
        variant="outlined"
      >
        <CardContent sx={{ p: 3 }}>
          {((phase == 20 && checkPermissions('ideas', 'approve')) ||
            (phase == 40 && checkPermissions('ideas', 'setWinner'))) &&
          isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack gap={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                  <ApproveField control={control} disabled={isLoading} />
                  <Button onClick={onClose} color="error" sx={{ ml: 'auto' }}>
                    {t('actions.cancel')}
                  </Button>
                  <Button type="submit" variant="contained">
                    {isLoading ? t('actions.loading') : t('actions.confirm')}
                  </Button>
                </Stack>
                {watch('approved') !== 1 && <MarkdownEditor name="approval_comment" control={control} required />}
              </Stack>
            </form>
          ) : (
            <Stack direction="row" alignItems="center" gap={2}>
              <AppIcon icon={approvalMessages[idea.approved + 1]} />
              <Stack flexGrow={1}>
                <Typography component={Box} variant="body2" sx={{ color: 'inherit' }}>
                  <MarkdownReader>
                    {idea.approval_comment || t(`scopes.ideas.${approvalMessages[idea.approved + 1]}`)}
                  </MarkdownReader>
                </Typography>
              </Stack>
              {checkPermissions('ideas', 'approve') && phase === 20 && (
                <AppIconButton icon="edit" onClick={() => setEditing(true)} sx={{ m: -1 }} />
              )}
            </Stack>
          )}
        </CardContent>
      </Card>
    )
  );
};

export default ApprovalCard;
