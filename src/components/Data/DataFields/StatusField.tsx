import { STATUS } from '@/utils/Data/formDefaults';
import { MenuItem, TextField, Typography } from '@mui/material';
import { amber, blueGrey, green, red } from '@mui/material/colors';
import { Control, Controller } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

interface Props {
  control: Control<any, any>;
  disabled?: boolean;
  onChange?: (...event: any[]) => void;
}

/**
 * Renders "SelectInput" component
 */

const StatusField: React.FC<Props> = ({ control, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();

  const colors = [red[900], green[700], amber[800], blueGrey[600]];

  return (
    <Controller
      name="status"
      control={control}
      defaultValue={control._defaultValues.status || 1}
      render={({ field, fieldState }) => {
        return (
          <TextField
            label="Status"
            required
            disabled={disabled}
            select
            size="small"
            {...field}
            {...restOfProps}
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {STATUS.map((status) => (
              <MenuItem value={status.value}>
                <Typography sx={{ color: colors[status.value], display: 'inline' }}>&#x25CF;</Typography>{' '}
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
