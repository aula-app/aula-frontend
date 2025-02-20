import AppIcon from '@/components/AppIcon';
import { IconType } from '@/components/AppIcon/AppIcon';
import { MarkdownEditor } from '@/components/DataFields';
import { approveIdea } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ButtonGroup, Card, CardContent, Stack, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

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

  const approvalMessages = ['reject', 'waiting', 'approve'] as IconType[];
  const approvalColors = ['against.main', 'disabled.main', 'for.main'];

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
  });
  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const onSubmit = (data: SchemaType) => {
    if (data.approved === 0) {
      setError('approved', { message: t('forms.validation.required') });
      return;
    }
    approveIdea({
      idea_id: idea.hash_id,
      ...data,
    });
  };

  const onReset = () => {
    reset();
  };

  return (
    <Card
      sx={{
        borderRadius: '25px',
        overflow: 'hidden',
        scrollSnapAlign: 'center',
        minHeight: 75,
        bgcolor: disabled ? 'disabled.main' : approvalColors[(watch('approved') ?? idea.approved) + 1],
      }}
      variant="outlined"
    >
      <CardContent>
        {!checkPermissions('ideas', 'approve') ? (
          <Stack direction="row" alignItems="center" gap={2}>
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
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack gap={2}>
              <Controller
                name="approved"
                control={control}
                render={({ field, fieldState }) => (
                  <Stack direction="row" alignItems="center" gap={1}>
                    <ButtonGroup sx={{ mr: 1 }}>
                      <Button
                        sx={{
                          border: '1px solid #888',
                          backgroundColor: field.value === -1 ? 'error.main' : 'disabled.main',
                        }}
                        onClick={() => field.onChange(-1)}
                        variant="contained"
                        size="small"
                      >
                        <AppIcon icon="rejected" />
                      </Button>
                      <Button
                        sx={{
                          border: '1px solid #888',
                          backgroundColor: field.value === 1 ? 'primary.main' : 'disabled.main',
                        }}
                        onClick={() => field.onChange(1)}
                        variant="contained"
                        size="small"
                      >
                        <AppIcon icon="approved" />
                      </Button>
                    </ButtonGroup>
                    <Typography color={fieldState.error ? 'error' : ''}>
                      {fieldState.error
                        ? fieldState.error.message
                        : t(`scopes.ideas.${approvalMessages[(field.value || 0) + 1]}`)}
                    </Typography>
                  </Stack>
                )}
              />
              <MarkdownEditor name="approval_comment" control={control} required />
              <Stack direction="row" justifyContent="end" gap={2}>
                <Button onClick={onReset} color="error">
                  {t('actions.cancel')}
                </Button>
                <Button type="submit" variant="contained">
                  {t('actions.confirm')}
                </Button>
              </Stack>
            </Stack>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default ApprovalCard;
