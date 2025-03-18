import { getUsers } from '@/services/users';
import { SelectOptionsType, SelectOptionType, UpdateType } from '@/types/SettingsTypes';
import { Autocomplete, BaseTextFieldProps, CircularProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  disabled?: boolean;
  onChange: (updates: UpdateType) => void;
}

/**
 * Renders "UserField" component
 */

const UserField: React.FC<Props> = ({ onChange, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();

  const emptyOption = { label: t('ui.common.all'), value: '' };

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<SelectOptionsType>([emptyOption]);
  const [selectedOption, setSelectedOption] = useState<SelectOptionType>(emptyOption);

  const fetchUsers = async () => {
    setLoading(true);
    const response = await getUsers();
    setLoading(false);
    if (!response.data) return;
    const noUser = [emptyOption];
    const users = response.data.map((user) => ({ label: user.displayname, value: user.hash_id }));
    setOptions([...noUser, ...users]);
  };

  const handleChange = (selected: SelectOptionType | null) => {
    setSelectedOption(selected ? selected : emptyOption);
  };

  useEffect(() => {
    // if (options.length > 0) {
    //   const filtered = options.filter((option) => defaultValues.includes(String(option.value)));
    //   setSelectedOptions(filtered);
    // }
  }, [options]);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={(_, value) => handleChange(value)}
      value={selectedOption}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => option.label}
      options={options}
      loading={loading}
      disabled={disabled}
      sx={{ width: 200 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('scopes.users.plural')}
          disabled={disabled}
          variant="filled"
          size="small"
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
