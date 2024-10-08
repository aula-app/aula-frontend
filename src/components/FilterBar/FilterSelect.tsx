import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest } from '@/utils';
import DataConfig from '@/utils/Data';
import { MenuItem, TextField } from '@mui/material';
import { ChangeEvent, Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  filter: [string, string];
  scope: SettingNamesType;
  setFilter: Dispatch<SetStateAction<[string, string]>>;
};

const FilterSelect = ({ filter, scope, setFilter }: Params) => {
  const { t } = useTranslation();
  const [customFields, setCustomFields] = useState<Record<string, string>>({});

  const getCustomFields = async () => {
    await databaseRequest({
      model: 'Settings',
      method: 'getCustomfields',
      arguments: {},
    }).then((response) => {
      if (!response.success) return;
      setCustomFields(response.data);
    });
  };

  const changeFilter = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter([event.target.value, filter[1]]);
  };

  useEffect(() => {
    if (scope === 'ideas') getCustomFields();
  }, []);

  return (
    <TextField
      select
      label={t('texts.filter')}
      value={filter[0]}
      onChange={changeFilter}
      variant="filled"
      size="small"
      sx={{ minWidth: 130 }}
    >
      <MenuItem value="">&nbsp;</MenuItem>
      {DataConfig[scope].columns
        .filter(
          (column) =>
            !['status', 'created', 'last_update', 'userlevel', 'phase', 'approv', 'target_id'].some((element) =>
              column.name.includes(element)
            )
        )
        .map((column) => {
          if ((column.name in customFields && customFields[column.name]) || !(column.name in customFields))
            return (
              <MenuItem value={column.name} key={column.name}>
                {customFields[column.name] || t(`settings.${column.name}`)}
              </MenuItem>
            );
        })}
    </TextField>
  );
};

export default FilterSelect;
