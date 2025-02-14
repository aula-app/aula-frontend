import { getCategories } from '@/services/categories';
import { SelectOptionsType, UpdateType } from '@/types/SettingsTypes';
import { Autocomplete, BaseTextFieldProps, Box, Chip, CircularProgress, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AppIcon from '../AppIcon';
import { IconType } from '../AppIcon/AppIcon';

interface Props extends BaseTextFieldProps {
  defaultValues: number[];
  disabled?: boolean;
  onChange: (updates: { add: number[]; remove: number[] }) => void;
}

/**
 * Renders "CategoryField" component
 */

type CategoryOptionsType = {
  label: string;
  value: number;
  icon: string;
}[];

const CategoryField: React.FC<Props> = ({ defaultValues, onChange, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<CategoryOptionsType>([]);
  const [selectedOptions, setSelectedOptions] = useState<CategoryOptionsType>([]);

  const fetchCategories = async () => {
    setLoading(true);
    const response = await getCategories();
    setLoading(false);
    if (!response.data) return;
    const categories = response.data.map((category) => ({
      label: category.name,
      value: category.id,
      icon: category.description_internal,
    }));
    setOptions(categories);
  };

  const handleChange = (selected: CategoryOptionsType) => {
    setSelectedOptions(selected);
    const selectedValues = selected.map((option) => Number(option.value));
    onChange({
      add: selectedValues.filter((value) => !defaultValues.includes(value)),
      remove: defaultValues.filter((value) => !selectedValues.includes(value)),
    });
  };

  useEffect(() => {
    if (options.length > 0) {
      const filtered = options.filter((option) => defaultValues.includes(Number(option.value)));
      setSelectedOptions(filtered);
    }
  }, [options, defaultValues]);

  useEffect(() => {
    fetchCategories();
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
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => (
          <Chip
            avatar={<AppIcon icon={option.icon as IconType} mr={1} />}
            label="Avatar"
            variant="outlined"
            {...getTagProps({ index })}
          />
        ));
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <AppIcon icon={option.icon as IconType} mr={1} />
            {option.label}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('scopes.categories.plural')}
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

export default CategoryField;
