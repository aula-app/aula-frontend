import { SettingForm, SettingNamesType } from '@/types/scopes/SettingsTypes';
import { databaseRequest, SettingsConfig } from '@/utils';
import { FormControl, FormHelperText, MenuItem, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Control, Controller, FieldErrors, UseFormGetValues, UseFormRegister } from 'react-hook-form-mui';

type Props = {
  content: SettingForm;
  control: Control<{}, any>;
  register: UseFormRegister<{}>;
  getValues: UseFormGetValues<{}>;
  errors: FieldErrors<{}>;
};

/**
 * Renders "FormInput" component
 */

const FormInput = ({ content, register, getValues, control, errors, ...restOfProps }: Props) => {
  const [currentOptions, setOptions] = useState(content.options || []);

  async function fetchOptions(setting: SettingNamesType) {
    await databaseRequest({
      model: SettingsConfig[setting].model,
      method: SettingsConfig[setting].requests.fetch,
      arguments: {
        limit: 0,
        offset: 0,
      },
    }).then((response) => {
      // @ts-ignore
      setOptions(response.data.map((row) => {
        return({ label: row[SettingsConfig[setting].rows[0].name], value: row.id })
    }));
    });
  }

  useEffect(() => {
    if (content.fetchOptions) fetchOptions(content.fetchOptions);
  }, [content.label]);

  return (
    <>
      {content.type === 'input' || content.type === 'text' ? (
        <TextField
          label={content.label}
          required={content.required}
          hidden={content.hidden}
          minRows={content.type === 'text' ? 4 : 1}
          multiline={content.type === 'text'}
          sx={content.hidden ? { display: 'none' } : { width: '100%' }}
          // @ts-ignore
          {...register(content.column)}
          // @ts-ignore
          error={errors[content.column] ? true : false}
          // @ts-ignore
          helperText={errors[content.column]?.message || ' '}
          {...restOfProps}
        />
      ) : (
        <Controller
          // @ts-ignore
          name={content.column}
          control={control}
          // @ts-ignore
          defaultValue={0}
          render={({ field, fieldState }) => (
            <FormControl fullWidth>
              <TextField
                label={content.label}
                required={content.required}
                fullWidth
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
