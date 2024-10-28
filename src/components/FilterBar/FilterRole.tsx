import { RoleTypes } from '@/types/SettingsTypes';
import { roles } from '@/utils';
import { MenuItem, TextField } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  role: RoleTypes | -1;
  setRole: Dispatch<SetStateAction<RoleTypes | -1>>;
};

const FilterRole = ({ role, setRole }: Params) => {
  const { t } = useTranslation();

  const changeRole = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRole(Number(event.target.value) as RoleTypes | -1);
  };

  return (
    <TextField
      select
      label={t('settings.userlevel')}
      value={role}
      onChange={changeRole}
      variant="filled"
      size="small"
      sx={{ flex: 1 }}
    >
      <MenuItem value={-1}>{t('status.all')}</MenuItem>
      {roles.map((roleItem) => (
        <MenuItem value={roleItem} key={roleItem}>
          {t(`roles.${roleItem}`)}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default FilterRole;
