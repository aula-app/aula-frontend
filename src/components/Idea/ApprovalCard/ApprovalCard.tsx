import AppIcon from '@/components/AppIcon';
import { IconType } from '@/components/AppIcon/AppIcon';
import AppIconButton from '@/components/AppIconButton';
import { MarkdownEditor } from '@/components/DataFields';
import ApproveField from '@/components/DataFields/ApproveField';
import MarkdownReader from '@/components/MarkdownReader';
import { setApprovalStatus } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
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
  const { phase } = useParams();

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
  };

  const onClose = () => {
    if (watch('approved') !== 0) setEditing(false);
    reset({ approved: idea.approved || 0, approval_comment: idea.approval_comment || '' });
  };

  useEffect(() => {
    reset({ approved: idea.approved || 0, approval_comment: idea.approval_comment || '' });
  }, [idea]);

  return Number(phase) == 20 || (Number(phase) > 20 && idea.approved !== 1) ? (
    <Card
      sx={{
        borderRadius: '25px',
        overflow: 'visible',
        scrollSnapAlign: 'center',
        bgcolor: disabled ? 'disabled.main' : approvalColors[(watch('approved') ?? idea.approved) + 1],
      }}
      variant="outlined"
    >
      <CardContent sx={{ p: 3 }}>
        {checkPermissions('ideas', 'approve') && isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack gap={2}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                <ApproveField control={control} disabled={isLoading} />
                <Button onClick={onClose} color="error" sx={{ ml: 'auto' }} data-testid="cancel-button">
                  {t('actions.cancel')}
                </Button>
                <Button type="submit" variant="contained" data-testid="confirm-button" disabled={isLoading}>
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
              {idea.approved === 0 && t('scopes.ideas.waiting')}
              {idea.approved === 1 && t('scopes.ideas.approved')}
              <Typography component={Box} variant="body2" sx={{ color: 'inherit' }}>
                {idea.approved === -1 && (
                  <MarkdownReader>
                    {idea.approval_comment || t(`scopes.ideas.${approvalMessages[idea.approved + 1]}`)}
                  </MarkdownReader>
                )}
              </Typography>
            </Stack>
            {checkPermissions('ideas', 'approve') && (
              <AppIconButton icon="edit" title={t('tooltips.edit')} onClick={() => setEditing(true)} sx={{ m: -1 }} />
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  ) : (
    <></>
  );
};

export default ApprovalCard;
