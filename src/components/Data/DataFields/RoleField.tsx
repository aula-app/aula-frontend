import { roles } from '@/utils';
import { MenuItem, TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

interface Props {
  control: Control<any, any>;
  disabled?: boolean;
  onChange?: (...event: any[]) => void;
}

/**
 * Renders "RoleField" component
 */

const RoleField: React.FC<Props> = ({ control, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();

  return (
    <Controller
      name="userlevel"
      control={control}
      defaultValue={control._defaultValues.status || 20}
      render={({ field }) => {
        return (
          <TextField
            label={t('settings.columns.userlevel')}
            required
            disabled={disabled}
            select
            size="small"
            {...field}
            {...restOfProps}
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {roles.map((role) => (
              <MenuItem value={role}>{t(`roles.${role}`)}</MenuItem>
            ))}
          </TextField>
        );
      }}
    />
  );
};

export default RoleField;
