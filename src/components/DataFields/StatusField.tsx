import { STATUS } from '@/utils';
import { MenuItem, TextField, Typography } from '@mui/material';
import { amber, blueGrey, green, red } from '@mui/material/colors';
import { Control, Controller, FieldValues, Path } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

interface Props<T extends FieldValues = FieldValues> {
  control: Control<T>;
  disabled?: boolean;
  onChange?: (...event: unknown[]) => void;
}

/**
 * Renders "StatusField" component
 */

const StatusField = <T extends FieldValues = FieldValues>({ control, disabled = false, ...restOfProps }: Props<T>) => {
  const { t } = useTranslation();

  const colors = [red[900], green[700], amber[800], blueGrey[600]];

  return (
    <Controller
      name={'status' as Path<T>}
      control={control}
      defaultValue={(control._defaultValues as FieldValues).status || 1}
      render={({ field }) => {
        return (
          <TextField
            label={t('settings.columns.status')}
            required
            disabled={disabled}
            select
            size="small"
            {...field}
            {...restOfProps}
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {STATUS.map((status) => (
              <MenuItem value={status.value} key={status.value}>
                <Typography sx={{ color: colors[status.value], display: 'inline' }}>&#x25CF;</Typography>&nbsp;&nbsp;
                {t(status.label)}
              </MenuItem>
            ))}
          </TextField>
        );
      }}
    />
  );
};

export default StatusField;
