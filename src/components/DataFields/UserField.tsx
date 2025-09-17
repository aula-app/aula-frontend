import { getUsers } from '@/services/users';
import { UserOptionsType } from '@/types/SettingsTypes';
import { Autocomplete, BaseTextFieldProps, TextField, Typography } from '@mui/material';
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
    if (loading) return; // Prevent multiple simultaneous requests

    setLoading(true);
    try {
      const response = await getUsers();
      if (response.data) {
        const users = response.data.map((user) => ({
          label: user.realname,
          value: user.hash_id,
          displayname: user.displayname,
        }));
        setOptions(users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && options.length === 0) {
      fetchUsers();
    }
  }, [open, options.length]);

  // Load options on mount if there's a value to ensure proper display of selected option
  useEffect(() => {
    // Only fetch if we have no options and no loading is in progress
    if (options.length === 0 && !loading) {
      fetchUsers();
    }
  }, [options.length, loading]);

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
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => setOpen(false)}
            options={options}
            loading={loading}
            disabled={disabled}
            data-testid="user-field-autocomplete"
            isOptionEqualToValue={(option, value) => {
              if (!option || !value) return false;
              return option.value === value.value;
            }}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              return option?.label || '';
            }}
            value={selectedOption}
            onChange={(_, newValue) => {
              // Pass just the ID value to the form
              field.onChange(newValue ? newValue.value : null);
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.value} data-testid={`user-option-${option.value}`}>
                <span>
                  {option.label}
                  {option.displayname && (
                    <Typography component="span" ml={2} variant="body2" color="text.secondary">
                      ({option.displayname})
                    </Typography>
                  )}
                </span>
              </li>
            )}
            noOptionsText={loading ? 'Loading users...' : 'No users found'}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('scopes.users.name')}
                disabled={loading || disabled}
                error={!!fieldState.error}
                helperText={t(`${fieldState.error?.message || ''}`)}
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
