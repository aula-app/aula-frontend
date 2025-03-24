import { getUsers } from '@/services/users';
import { SelectOptionsType, SelectOptionType, UpdateType } from '@/types/SettingsTypes';
import { Autocomplete, BaseTextFieldProps, CircularProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  defaultValue: string | number; // Changed from defaultValues to defaultValue
  disabled?: boolean;
  onChange: (user_id: string | null) => void;
}

/**
 * Renders "UserField" component
 */

const UserField: React.FC<Props> = ({ defaultValue, onChange, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<SelectOptionsType>([]); // Ensure options is an array of SelectOptionsType
  const [selectedOption, setSelectedOption] = useState<SelectOptionType | null>(null); // Ensure selectedOption is nullable

  const fetchUsers = async () => {
    setLoading(true);
    const response = await getUsers();
    setLoading(false);
    if (!response.data) return;
    const users = response.data.map((user) => ({ label: user.displayname, value: user.hash_id }));
    setOptions(users);
  };

  const handleChange = (selected: SelectOptionType | null) => {
    setSelectedOption(selected);
    const selectedValue = selected ? String(selected.value) : null;
    onChange(selectedValue);
  };

  useEffect(() => {
    if (options.length > 0 && defaultValue) {
      const filtered = options.find((option) => String(option.value) === defaultValue);
      setSelectedOption(filtered || null);
    }
  }, [options, defaultValue]);

  useEffect(() => {
    fetchUsers();
  }, [defaultValue]);

  return (
    <Autocomplete
      fullWidth
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={(_, value) => handleChange(value as SelectOptionType | null)} // Ensure proper type casting
      value={selectedOption}
      isOptionEqualToValue={(option, value) => option.value === value?.value}
      getOptionLabel={(option) => option.label}
      options={options}
      loading={loading}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('scopes.users.name')}
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
