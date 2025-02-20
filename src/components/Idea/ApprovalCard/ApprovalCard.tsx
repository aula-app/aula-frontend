import AppIcon from '@/components/AppIcon';
import { IconType } from '@/components/AppIcon/AppIcon';
import AppIconButton from '@/components/AppIconButton';
import { MarkdownEditor } from '@/components/DataFields';
import ApproveField from '@/components/DataFields/ApproveField';
import { setApprovalStatus } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

interface ApprovalCardProps {
  idea: IdeaType;
  disabled?: boolean;
  onReload: () => void;
}

/**
 * Renders "Welcome" view
 * url: /
 */

const ApprovalCard = ({ idea, disabled = false, onReload }: ApprovalCardProps) => {
  const { t } = useTranslation();

  const approvalMessages = ['rejected', 'waiting', 'approved'] as IconType[];
  const approvalColors = ['against.main', 'disabled.main', 'for.main'];

  const [isLoading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);

  const schema = yup.object().shape({
    approved: yup.number().required(t('forms.validation.required')),
    approval_comment: yup.string().required(t('forms.validation.required')),
  });

  const {
    reset,
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { approved: idea.approved || 0, approval_comment: idea.approval_comment || '' },
  });
  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const onSubmit = async (data: SchemaType) => {
    if (data.approved === 0) {
      setError('approved', { message: t('forms.validation.required') });
      return;
    }
    setLoading(true);
    await setApprovalStatus({
      idea_id: idea.hash_id,
      ...data,
    });
    setLoading(false);
    setEditing(false);
    onReload();
  };

  const onClose = () => {
    if (watch('approved') !== 0) setEditing(false);
    reset({ approved: idea.approved || 0, approval_comment: idea.approval_comment || '' });
  };

  useEffect(() => {
    reset({ approved: idea.approved || 0, approval_comment: idea.approval_comment || '' });
  }, [idea]);

  return (
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
        {checkPermissions('ideas', 'approve') && (watch('approved') === 0 || isEditing) ? (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack gap={2}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                <ApproveField control={control} disabled={isLoading} />
                {watch('approved') !== 0 && <AppIconButton icon="close" onClick={onClose} sx={{ m: -1 }} />}
              </Stack>
              <MarkdownEditor name="approval_comment" control={control} required />
              <Stack direction="row" justifyContent="end" gap={2}>
                <Button onClick={onClose} color="error">
                  {t('actions.cancel')}
                </Button>
                <Button type="submit" variant="contained">
                  {isLoading ? t('actions.loading') : t('actions.confirm')}
                </Button>
              </Stack>
            </Stack>
          </form>
        ) : (
          <Stack direction="row" alignItems="center" gap={2}>
            <AppIcon icon={approvalMessages[idea.approved + 1]} />
            <Stack flexGrow={1}>
              <Typography variant="body2" sx={{ color: 'inherit' }}>
                {idea.approval_comment || t(`scopes.ideas.${approvalMessages[idea.approved + 1]}`)}
              </Typography>
            </Stack>
            {checkPermissions('ideas', 'approve') && (
              <AppIconButton icon="edit" onClick={() => setEditing(true)} sx={{ m: -1 }} />
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default ApprovalCard;
