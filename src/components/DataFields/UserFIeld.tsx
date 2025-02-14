import { getUsers } from '@/services/users';
import { SelectOptionsType, UpdateType } from '@/types/SettingsTypes';
import { Autocomplete, BaseTextFieldProps, CircularProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  defaultValues: string[];
  hasError?: boolean;
  disabled?: boolean;
  onChange: (updates: UpdateType) => void;
}

/**
 * Renders "UserField" component
 */

const UserField: React.FC<Props> = ({
  defaultValues,
  onChange,
  hasError = false,
  disabled = false,
  ...restOfProps
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<SelectOptionsType>([]);
  const [selectedOptions, setSelectedOptions] = useState<SelectOptionsType>([]);

  const fetchUsers = async () => {
    setLoading(true);
    const response = await getUsers();
    setLoading(false);
    if (!response.data) return;
    const users = response.data.map((user) => ({ label: user.displayname, value: user.hash_id }));
    setOptions(users);
  };

  const handleChange = (selected: SelectOptionsType) => {
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

export default UserField;
