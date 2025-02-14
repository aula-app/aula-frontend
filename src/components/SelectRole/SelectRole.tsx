import { RoleTypes } from '@/types/SettingsTypes';
import { BaseSelectProps, BaseTextFieldProps, MenuItem, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  userRole: RoleTypes | 0 | undefined;
  setRole: React.Dispatch<React.SetStateAction<RoleTypes | 0 | undefined>>;
}

const SelectRoom: React.FC<Props> = ({ userRole, setRole, ...restOfProps }) => {
  const { t } = useTranslation();

  return (
    <TextField
      select
      label={t('settings.columns.userlevel')}
      value={userRole || ''}
      onChange={(event) =>
        setRole(typeof event.target.value === 'number' ? (event.target.value as RoleTypes | 0) : undefined)
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

export default SelectRoom;
