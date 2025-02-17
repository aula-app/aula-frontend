import { RoleTypes } from '@/types/SettingsTypes';
import { roles } from '@/utils';
import { BaseTextFieldProps, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  userRole: RoleTypes | 0 | undefined;
  noAdmin?: boolean;
  setRole: (role: RoleTypes | 0 | undefined) => void;
}

const SelectRole: React.FC<Props> = ({ userRole, noAdmin = false, setRole, ...restOfProps }) => {
  const { t } = useTranslation();

  return (
    <TextField
      select
      label={t('settings.columns.userlevel')}
      value={userRole || ''}
      onChange={(event) =>
        setRole(typeof event.target.value === 'number' ? (event.target.value as RoleTypes) : undefined)
      }
      sx={{ minWidth: 200 }}
      {...restOfProps}
    >
      {roles
        .filter((role) => (noAdmin ? role < 50 : true))
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
