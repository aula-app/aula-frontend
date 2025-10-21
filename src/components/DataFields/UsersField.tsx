import { getUsers } from '@/services/users';
import { UpdateType, UserOptionsType } from '@/types/SettingsTypes';
import { Autocomplete, BaseTextFieldProps, CircularProgress, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  defaultValues: string[];
  disabled?: boolean;
  onChange: (updates: UpdateType) => void;
}

/**
 * Renders "UserField" component
 */

const UsersField: React.FC<Props> = ({ defaultValues, onChange, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<UserOptionsType>([]);
  const [selectedOptions, setSelectedOptions] = useState<UserOptionsType>([]);

  const fetchUsers = async () => {
    setLoading(true);
    const response = await getUsers();
    setLoading(false);
    if (!response.data) return;
    const users = response.data.map((user) => ({
      label: user.realname,
      value: user.hash_id,
      displayname: user.displayname,
      username: user.username,
    }));
    setOptions(users);
  };

  const handleChange = (selected: UserOptionsType) => {
    setSelectedOptions(selected);
    const selectedValues = selected.map((option) => String(option.value));
    onChange({
      add: selectedValues.filter((value) => !defaultValues.includes(value)),
      remove: defaultValues.filter((value) => !selectedValues.includes(value)),
    });
  };

  useEffect(() => {
    if (options.length > 0) {
      const filtered = options.filter((option) => defaultValues.includes(String(option.value)));
      setSelectedOptions(filtered);
    }
  }, [options, defaultValues]);

  useEffect(() => {
    fetchUsers();
  }, [defaultValues]);

  return (
    <Autocomplete
      multiple
      fullWidth
      data-testid="users-field"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={(_, value) => handleChange(value)}
      value={selectedOptions}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => option.label}
      options={options}
      loading={loading}
      disabled={disabled}
      renderOption={(props, option) => (
        <li {...props} key={option.value} data-testid={`user-option-${option.username}`}>
          {option.label}{' '}
          <Typography ml={2} variant="body2" color="text.secondary">
            ({option.displayname})
          </Typography>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('scopes.users.plural')}
          disabled={disabled}
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
          }}
          {...restOfProps}
        />
      )}
    />
  );
};

export default UsersField;
