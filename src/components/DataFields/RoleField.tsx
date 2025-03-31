import { roles } from '@/utils';
import { BaseTextFieldProps, MenuItem, TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  control: Control<any, any>;
  disabled?: boolean;
  noAdmin?: boolean;
  onChange?: (...event: any[]) => void;
}

/**
 * Renders "RoleField" component
 */

const RoleField: React.FC<Props> = ({ control, disabled = false, noAdmin = false, ...restOfProps }) => {
  const { t } = useTranslation();

  return (
    <Controller
      name="userlevel"
      control={control}
      defaultValue={control._defaultValues.userlevel || 0}
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
            <MenuItem value="0">{t(`roles.empty`)}</MenuItem>
            {roles
              .filter((role) => role < 30 || role >= 40)
              .filter((role) => (noAdmin ? role < 40 : role < 60))
              .map((role) => (
                <MenuItem value={role}>{t(`roles.${role}`)}</MenuItem>
              ))}
          </TextField>
        );
      }}
    />
  );
};

export default RoleField;
