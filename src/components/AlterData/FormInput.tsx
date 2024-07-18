import { SettingNamesType } from '@/types/scopes/SettingsTypes';
import {
  databaseRequest,
  dataSettings,
  formsSettings,
  getRequest,
  requestDefinitions,
  SelectOptionsType,
} from '@/utils';
import { FormControl, FormHelperText, MenuItem, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Control, Controller, FieldErrors, UseFormGetValues, UseFormRegister } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

type Props = {
  form: keyof typeof formsSettings;
  control: Control<{}, any>;
  disabled?: boolean;
  register: UseFormRegister<{}>;
  getValues: UseFormGetValues<{}>;
  errors: FieldErrors<{}>;
};

/**
 * Renders "FormInput" component
 */

const FormInput = ({ form, register, getValues, control, errors, disabled = false, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  const [currentOptions, setOptions] = useState<SelectOptionsType[]>([]);

  async function fetchOptions(scope: SettingNamesType) {
    await databaseRequest({
      model: requestDefinitions[scope].model,
      method: getRequest(scope, 'fetch'),
      arguments: {
        limit: 0,
        offset: 0,
      },
    }).then((response) => {
      setOptions(
        // @ts-ignore
        response.data.map((row) => {
          return { label: row[dataSettings[scope][0]], value: row.id };
        })
      );
    });
  }

  useEffect(() => {
    if (Object.hasOwn(formsSettings[form], 'options')) {
      if (!('options' in formsSettings[form]) || formsSettings[form].options === undefined) return;
      typeof formsSettings[form].options === 'string'
        ? fetchOptions(formsSettings[form].options)
        : setOptions(formsSettings[form].options);
    }
  }, [form]);

  return (
    <>
      {formsSettings[form].type !== 'select' ? (
        <TextField
          label={t(`settings.${form}`)}
          required
          minRows={formsSettings[form].type === 'text' ? 4 : 1}
          multiline={formsSettings[form].type === 'text'}
          disabled={disabled}
          fullWidth
          // @ts-ignore
          {...register(form)}
          // @ts-ignore
          error={errors[form] ? true : false}
          // @ts-ignore
          helperText={errors[form]?.message || ' '}
          {...restOfProps}
        />
      ) : (
        <Controller
          // @ts-ignore
          name={form}
          control={control}
          // @ts-ignore
          defaultValue={0}
          render={({ field, fieldState }) => (
            <FormControl fullWidth>
              <TextField
                label={t(`settings.${form}`)}
                required
                fullWidth
                disabled={disabled}
                select
                // @ts-ignore
                {...field}
                // @ts-ignore
                error={!!fieldState.error}
                {...restOfProps}
              >
                {currentOptions.map((option) => (
                  <MenuItem value={option.value} key={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <FormHelperText
                error={
                  // @ts-ignore
                  fieldState.error ? true : false
                }
              >
                {
                  // @ts-ignore
                  fieldState.error?.message || ' '
                }
              </FormHelperText>
            </FormControl>
          )}
        />
      )}
    </>
  );
};

export default FormInput;
