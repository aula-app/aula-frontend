import AppIcon from '@/components/AppIcon';
import { IconType } from '@/components/AppIcon/AppIcon';
import AppIconButton from '@/components/AppIconButton';
import { MarkdownEditor } from '@/components/DataFields';
import SetWinnerField from '@/components/DataFields/SetWinnerField';
import { setWinning, setApprovalStatus } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { PhaseType, RoomPhases } from '@/types/SettingsTypes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

interface SetWinnerCardProps {
  idea: IdeaType;
  phase: number;
  disabled?: boolean;
  onReload: () => void;
}

/**
 * Renders "Welcome" view
 * url: /
 */

const SetWinnerCard = ({ idea, phase, disabled = false, onReload }: SetWinnerCardProps) => {
  const { t } = useTranslation();

  const winnerMessages = ['rejected', 'waiting', 'approved'] as IconType[];
  const winnerColors = ['against.main', 'disabled.main', 'for.main'];

  const [isLoading, setLoading] = useState(false);

  const schema = yup.object().shape({
    is_winner: yup.number().required(t('forms.validation.required')),
  });

  const {
    reset,
    control,
    handleSubmit,
    setError,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { is_winner: idea.is_winner || 0 },
  });
  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const [isEditing, setEditing] = useState(getValues('is_winner') === 0);

  const onSubmit = async (data: SchemaType) => {
    // if (data.is_winner === 0) {
    //   setError('is_winner', { message: t('forms.validation.required') });
    //   return;
    // }
    setLoading(true);

//    await setApprovalStatus({
//      idea_id: idea.hash_id,
//      ...data,
//    });
    const result = await setWinning((data.is_winner == 1), idea.hash_id);

    setLoading(false);
    setEditing(false);
    onReload();

  };

  const onClose = () => {
    if (watch('is_winner') !== 0) setEditing(false);
    reset({ is_winner: idea.is_winner || 0 });
  };

  useEffect(() => {
    reset({ is_winner: idea.is_winner || 0 });
  }, [idea]);

  return (
    (!!checkPermissions('ideas', 'setWinner')) && (
    <Card
      sx={{
        borderRadius: '25px',
        overflow: 'hidden',
        scrollSnapAlign: 'center',
        bgcolor: disabled ? 'disabled.main' : winnerColors[(watch('is_winner') ?? idea.is_winner) + 1],
      }}
      variant="outlined"
    >
      <CardContent sx={{ p: 3 }}>
        {(checkPermissions('ideas', 'setWinner'))  ? (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack gap={2}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                <SetWinnerField control={control} disabled={isLoading} />
              </Stack>
              <Stack direction="row" justifyContent="end" gap={2}>
                <Button type="submit" variant="contained">
                  {isLoading ? t('actions.loading') : t('actions.confirm')}
                </Button>
              </Stack>
            </Stack>
          </form>
        ) : (<></>)}
      </CardContent>
    </Card>)
  );
};

export default SetWinnerCard;
