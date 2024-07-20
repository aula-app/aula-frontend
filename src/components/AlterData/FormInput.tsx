import { SettingNamesType } from '@/types/SettingsTypes';
import {
  databaseRequest,
  dataSettings,
  formsSettings,
  getRequest,
  requestDefinitions,
  SelectOptionsType,
} from '@/utils';
import { FormControl, FormHelperText, MenuItem, Stack, TextField, Typography } from '@mui/material';
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
          return { label: row[dataSettings[scope][0].name], value: row.id };
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

  switch (formsSettings[form].type) {
    case 'select':
      return (
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
      );
    case 'duration':
      return (
        <Stack direction="row" alignItems="center" px={1}>
          <Typography noWrap pb={1} mr="auto">
            {t(`settings.${form}`)}:
          </Typography>
          <TextField
            required
            disabled={disabled}
            type="number"
            variant="standard"
            // @ts-ignore
            {...register(form)}
            // @ts-ignore
            error={errors[form] ? true : false}
            // @ts-ignore
            helperText={errors[form]?.message || ' '}
            sx={{ mx: 2, width: 80 }}
            {...restOfProps}
          />
          <Typography noWrap pb={1}>
            {t(`generics.days`)}
          </Typography>
        </Stack>
      );
    default:
      return (
        <TextField
          label={t(`settings.${form}`)}
          required
          minRows={formsSettings[form].type === 'text' ? 4 : 1}
          multiline={formsSettings[form].type === 'text'}
          disabled={disabled}
          type={formsSettings[form].type}
          fullWidth
          // @ts-ignore
          {...register(form)}
          // @ts-ignore
          error={errors[form] ? true : false}
          // @ts-ignore
          helperText={errors[form]?.message || ' '}
          {...restOfProps}
        />
      );
  }
};

export default FormInput;
