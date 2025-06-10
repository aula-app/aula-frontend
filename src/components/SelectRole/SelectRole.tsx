import { RoleTypes } from '@/types/SettingsTypes';
import { roles } from '@/utils';
import { BaseTextFieldProps, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  userRole: RoleTypes | 0;
  noAdmin?: boolean;
  noRoom?: boolean;
  allowAll?: boolean;
  onChange: (role: RoleTypes | 0) => void;
}

const SelectRole: React.FC<Props> = ({
  userRole,
  noAdmin = false,
  noRoom = false,
  allowAll = false,
  onChange,
  ...restOfProps
}) => {
  const { t } = useTranslation();

  return (
    <TextField
      select
      label={t('settings.columns.userlevel')}
      value={userRole || 0} // Ensure default value is applied
      onChange={(event) => onChange(Number(event.target.value) as RoleTypes | 0)} // Ensure value is cast to number
      sx={{ minWidth: 200 }}
      {...restOfProps}
    >
      {noRoom && (
        <MenuItem value={0} key={0}>
          {t(`roles.empty`)}
        </MenuItem>
      )}
      {allowAll && (
        <MenuItem value={0} key={-1}>
          {t('ui.common.all')}
        </MenuItem>
      )}
      {roles
        .filter((role) => (noAdmin ? role < 40 : true))
        .map((role) => (
          <MenuItem value={role} key={role}>
            {t(`roles.${role}`)}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default SelectRole;
