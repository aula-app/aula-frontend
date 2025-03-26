import { RoleTypes } from '@/types/SettingsTypes';
import { roles } from '@/utils';
import { BaseTextFieldProps, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  userRole: RoleTypes | 0;
  noAdmin?: boolean;
  noRoom?: boolean;
  onChange: (role: RoleTypes | 0) => void;
}

const SelectRole: React.FC<Props> = ({ userRole, noAdmin = false, noRoom = false, onChange, ...restOfProps }) => {
  const { t } = useTranslation();

  return (
    <TextField
      select
      label={t('settings.columns.userlevel')}
      value={userRole || 0}
      onChange={(event) => onChange(typeof event.target.value === 'number' ? (event.target.value as RoleTypes) : 0)}
      sx={{ minWidth: 200 }}
      {...restOfProps}
    >
      {noRoom && <MenuItem value={0}>{t(`roles.empty`)}</MenuItem>}
      {roles
        .filter((role) => (noAdmin ? role < 40 : true))
        .map((role) => {
          const userRoleOption = role;
          return (
            <MenuItem value={userRoleOption} key={userRoleOption}>
              {t(`roles.${userRoleOption}`)}
            </MenuItem>
          );
        })}
    </TextField>
  );
};

export default SelectRole;
