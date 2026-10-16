import { Button, ButtonGroup, ButtonGroupProps, Stack, Typography } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import AppIcon from '../AppIcon';

interface Props<T extends FieldValues = FieldValues> extends ButtonGroupProps {
  control: Control<T>;
  disabled?: boolean;
  onChange?: (...event: unknown[]) => void;
}

/**
 * Renders "ApproveField" component
 */

const ApproveField = <T extends FieldValues = FieldValues>({ control, disabled = false, ...restOfProps }: Props<T>) => {
  const { t } = useTranslation();

  const approvalMessages = ['reject', 'waiting', 'approve'];

  return (
    <Controller
      name={'approved' as Path<T>}
      control={control}
      render={({ field, fieldState }) => (
        <Stack direction="row" alignItems="center" gap={1}>
          <ButtonGroup sx={{ mr: 1 }} {...restOfProps}>
            <Button
              sx={{
                border: '1px solid #888',
                backgroundColor: field.value === -1 ? 'error.main' : 'disabled.main',
              }}
              onClick={() => field.onChange(-1)}
              variant="contained"
              size="small"
              data-testid="reject-button"
              disabled={disabled}
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
              data-testid="approve-button"
              disabled={disabled}
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
  );
};

export default ApproveField;
