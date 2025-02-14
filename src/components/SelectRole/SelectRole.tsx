import { RoleTypes } from '@/types/SettingsTypes';
import { BaseTextFieldProps, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  userRole: RoleTypes | 0 | undefined;
  setRole: (role: RoleTypes | 0 | undefined) => void;
}

const SelectRole: React.FC<Props> = ({ userRole, setRole, ...restOfProps }) => {
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
      {[...Array(5)].map((_, i) => {
        const userRoleOption = ((i + 1) * 10) as RoleTypes;
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
