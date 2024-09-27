import { StatusTypes } from '@/types/Generics';
import { SettingNamesType } from '@/types/SettingsTypes';
import { statusOptions } from '@/utils/commands';
import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  setStatus: Dispatch<SetStateAction<StatusTypes>>;
};

const FilterStatus = ({ setStatus }: Params) => {
  const { t } = useTranslation();

  const changeStatus = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (!setStatus) return;
    setStatus(Number(event.target.value) as StatusTypes);
  };

  return (
    <Stack direction="row" alignItems="center" p={2} pt={0} gap={2}>
      <Typography>{t('texts.show')}</Typography>
      <TextField
        select
        label={t('settings.status')}
        value={status}
        onChange={changeStatus}
        variant="filled"
        size="small"
        sx={{ minWidth: 200 }}
      >
        {statusOptions.map((column) => (
          <MenuItem value={column.value} key={column.label}>
            {t(column.label)}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};

export default FilterStatus;
