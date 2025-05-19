import { getUsers } from '@/services/users';
import { UserOptionsType } from '@/types/SettingsTypes';
import { Autocomplete, BaseTextFieldProps, CircularProgress, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  disabled?: boolean;
  control: Control<any, any>;
}

/**
 * Renders "UserField" component
 */

const UserField: React.FC<Props> = ({ control, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<UserOptionsType>([]); // Ensure options is an array of SelectOptionsType

  const fetchUsers = async () => {
    setLoading(true);
    const response = await getUsers();
    setLoading(false);
    if (!response.data) return;
    const users = response.data.map((user) => ({
      label: user.realname,
      value: user.hash_id,
      displayname: user.displayname,
    }));
    setOptions(users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Controller
      name="target_id"
      control={control}
      render={({ field, fieldState }) => {
        // Find the option object that matches the current field value
        const selectedOption =
          field.value !== undefined && field.value !== null
            ? options.find((option) => option.value === field.value) || null
            : null;

        return (
          <Autocomplete
            fullWidth
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            loading={loading}
            disabled={disabled}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
            getOptionLabel={(option) => option?.label || ''}
            value={selectedOption}
            onChange={(_, newValue) => {
              // Pass just the ID value to the form
              field.onChange(newValue ? newValue.value : null);
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.value}>
                {option.label}{' '}
                <Typography ml={2} variant="body2" color="text.secondary">
                  ({option.displayname})
                </Typography>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('scopes.users.name')}
                id="user-field-target"
                disabled={disabled}
                error={!!fieldState.error}
                helperText={<span id="user-error-message">{t(`${fieldState.error?.message || ''}`)}</span>}
                inputProps={{
                  'aria-labelledby': 'user-field-target-label',
                  'aria-invalid': !!fieldState.error,
                  'aria-errormessage': fieldState.error ? 'user-error-message' : undefined
                }}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                  inputLabel: {
                    id: 'user-field-target-label',
                    htmlFor: 'user-field-target',
                  },
                }}
                {...restOfProps}
              />
            )}
          />
        );
      }}
    />
  );
};

export default UserField;
