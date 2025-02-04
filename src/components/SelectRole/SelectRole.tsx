import { RoleTypes } from '@/types/SettingsTypes';
import { MenuItem, TextField } from '@mui/material';
import { ChangeEvent, ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  role: RoleTypes | 0;
  setRole: React.Dispatch<React.SetStateAction<RoleTypes | 0>>;
};

const SelectRoom = ({ role, setRole }: Params) => {
  const { t } = useTranslation();

  return (
    <TextField
      select
      label={t('settings.columns.userlevel')}
      value={role}
      onChange={(event) => setRole(Number(event.target.value) as RoleTypes | 0)}
      variant="filled"
      size="small"
      sx={{ minWidth: 200 }}
    >
      <MenuItem value="">&nbsp;</MenuItem>
      {[...Array(5)].map((_, i) => {
        const roleOption = (i + 1) * 10;
        return (
          <MenuItem value={roleOption} key={roleOption}>
            {t(`roles.${roleOption}`)}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default SelectRoom;
