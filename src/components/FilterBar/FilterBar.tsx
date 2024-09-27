import AppIconButton from '@/components/AppIconButton';
import { StatusTypes } from '@/types/Generics';
import { SettingNamesType } from '@/types/SettingsTypes';
import DataConfig from '@/utils/Data';
import { STATUS } from '@/utils/Data/formDefaults';
import { Collapse, FilledInput, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import FilterSelect from './FilterSelect';

type Params = {
  filter: [string, string];
  statusOptions?: typeof STATUS;
  status?: StatusTypes;
  isOpen: boolean;
  scope: SettingNamesType;
  setFilter: Dispatch<SetStateAction<[string, string]>>;
  setStatus?: Dispatch<SetStateAction<StatusTypes>>;
};

const FilterBar = ({ filter, status, statusOptions, scope, isOpen, setFilter, setStatus }: Params) => {
  const { t } = useTranslation();

  const changeFilter = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter([event.target.value, filter[1]]);
  };

  const changeStatus = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (!setStatus) return;
    setStatus(Number(event.target.value) as StatusTypes);
  };

  const changeSearch = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter([filter[0], event.target.value]);
  };

  return (
    <Collapse in={isOpen}>
      <Stack direction="row" alignItems="center" flexWrap="wrap">
        <Stack direction="row" alignItems="center" p={2} pt={0} gap={1}>
          <FilterSelect scope={scope} filter={filter} setFilter={setFilter} />
          <FilledInput
            size="small"
            onChange={changeSearch}
            value={filter[1]}
            disabled={filter[0] === ''}
            endAdornment={<AppIconButton icon="close" onClick={() => setFilter(['', ''])} />}
          />
        </Stack>
        {statusOptions && typeof status !== 'undefined' && (
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
        )}
      </Stack>
    </Collapse>
  );
};

export default FilterBar;
