import { getCategories } from '@/services/categories';
import { Autocomplete, BaseTextFieldProps, CircularProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIcon from '../AppIcon';
import { IconType } from '../AppIcon/AppIcon';
import { getGroups } from '@/services/groups';
import { SelectOptionType } from '@/types/SettingsTypes';

interface Props extends BaseTextFieldProps {
  defaultValue: number;
  disabled?: boolean;
  onChange: (value: string | number) => void;
}

/**
 * Renders "GroupField" component
 */

const GroupField: React.FC<Props> = ({ defaultValue, onChange, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<SelectOptionType[]>([]);
  const [value, setValue] = useState<SelectOptionType>({ label: '', value: 0 });

  const fetchCategories = async () => {
    setLoading(true);
    const response = await getGroups();
    setLoading(false);
    if (!response.data) return;
    const categories = response.data.map((group) => ({
      label: group.group_name,
      value: group.id,
    }));
    setOptions(categories);
  };

  const handleChange = (value: SelectOptionType | null) => {
    const selected = options.filter((options) => options.value === value?.value)[0];
    setValue(selected);
    onChange(value?.value || 0);
  };

  useEffect(() => {
    if (options.length > 0) {
      const currentId = defaultValue || 0;
      setValue(options.filter((option) => option.value === currentId)[0]);
    }
  }, [options, defaultValue]);

  useEffect(() => {
    fetchCategories();
  }, [defaultValue]);

  return (
    <Autocomplete
      fullWidth
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={(_, value) => handleChange(value)}
      value={value || null}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => option.label}
      options={options}
      loading={loading}
      disabled={disabled}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.label}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('scopes.groups.name')}
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

export default GroupField;
