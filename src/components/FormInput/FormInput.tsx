import { SettingForm, SettingNamesType } from '@/types/SettingsTypes';
import SettingsConfig from '@/utils/Settings';
import { databaseRequest } from '@/utils/requests';
import { FormHelperText, MenuItem, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form-mui';

type Props = {
  content: SettingForm;
  register: UseFormRegister<{}>;
  errors: FieldErrors<{}>;
};

/**
 * Renders "FormInput" component
 */

const FormInput = ({ content, register, errors, ...restOfProps }: Props) => {
  const [currentOptions, setOptions] = useState(content.options || []);

  async function fetchOptions(setting: SettingNamesType) {
    await databaseRequest('model', {
      model: SettingsConfig[setting].model,
      method: SettingsConfig[setting].requests.fetch,
      arguments: {
        limit: 0,
        offset: 0,
      },
    }).then((response) => {
      // @ts-ignore
      setOptions(response.data.map(({ id, room_name }) => ({ label: room_name, value: id })));
    });
  }

  useEffect(() => {
    if (content.fetchOptions) fetchOptions(content.fetchOptions);
  }, [content.label]);

  return (
    <>
      {content.type !== 'select' ? (
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
        <>
          <TextField
            label={content.label}
            required={content.required}
            fullWidth
            select
            // @ts-ignore
            {...register(content.column)}
            // @ts-ignore
            error={errors[content.column] ? true : false}
            {...restOfProps}
          >
            {currentOptions.map((option) => (
              <MenuItem value={option.value} key={option.label  }>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <FormHelperText
            error={
              // @ts-ignore
              errors[content.column] ? true : false
            }
          >
            {
              // @ts-ignore
              errors[content.column]?.message || ' '
            }
          </FormHelperText>
        </>
      )}
    </>
  );
};

export default FormInput;
