import { RoleTypes } from '@/types/SettingsTypes';
import { MenuItem, TextField } from '@mui/material';
import { ChangeEvent, ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  role: RoleTypes;
  setRole: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

const SelectRoom = ({ role, setRole }: Params) => {
  const { t } = useTranslation();

  const changeRoom = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRole(event);
  };

  return (
    <TextField
      select
      label={t('settings.userlevel')}
      value={role}
      onChange={changeRoom}
      variant="filled"
      size="small"
      sx={{ minWidth: 200 }}
    >
      <MenuItem value="">&nbsp;</MenuItem>
      {[...Array(4)].map((option, i) => {
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
