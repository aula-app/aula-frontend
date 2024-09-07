import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest, dataSettings, scopeDefinitions } from '@/utils';
import { FormControl, FormHelperText, MenuItem, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { InputSettings } from '../../EditData/DataConfig';
import { SelectOptionsType } from '../../EditData/DataConfig/formDefaults';

type Props = {
  data: InputSettings;
  control: Control<{}, any>;
  disabled?: boolean;
};

/**
 * Renders "SelectInput" component
 */

const SelectField = ({ data, control, disabled = false, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  const [currentOptions, setOptions] = useState<SelectOptionsType[]>([]);

  async function fetchOptions(scope: SettingNamesType) {
    await databaseRequest({
      model: scopeDefinitions[scope].model,
      method: scopeDefinitions[scope].fetch,
      arguments: {
        limit: 0,
        offset: 0,
      },
    }).then((response) => {
      setOptions(
        // @ts-ignore
        response.data.map((row) => {
          return { label: row[dataSettings[scope][0].name], value: row.id };
        })
      );
    });
  }

  useEffect(() => {
    if (Object.hasOwn(data.form, 'options')) {
      if (!('options' in data.form) || data.form.options === undefined) return;
      typeof data.form.options === 'string' ? fetchOptions(data.form.options) : setOptions(data.form.options);
    }
  }, [data.form]);

  return (
    <Controller
      // @ts-ignore
      name={data.name}
      control={control}
      // @ts-ignore
      defaultValue={0}
      render={({ field, fieldState }) => (
        <FormControl fullWidth>
          <TextField
            label={t(`settings.${data.name}`)}
            required
            fullWidth
            disabled={disabled}
            select
            {...field}
            error={!!fieldState.error}
            {...restOfProps}
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {currentOptions.map((option) => (
              <MenuItem value={option.value} key={option.label}>
                {t(option.label)}
              </MenuItem>
            ))}
          </TextField>
          <FormHelperText error={!!fieldState.error}>{t(fieldState.error?.message || ' ')}</FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default SelectField;
