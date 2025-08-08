import { getGroups } from '@/services/groups';
import { SelectOptionsType } from '@/types/SettingsTypes';
import { Autocomplete, BaseTextFieldProps, CircularProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  disabled?: boolean;
  control: Control<any, any>;
}

/**
 * Renders "GroupField" component
 */

const GroupField: React.FC<Props> = ({ control, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<SelectOptionsType>([]); // Ensure options is an array of SelectOptionsType

  const fetchGroups = async () => {
    setLoading(true);
    const response = await getGroups();
    setLoading(false);
    if (!response.data) return;
    const groups = response.data.map((group) => ({ label: group.group_name, value: group.id }));
    setOptions(groups);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <Controller
      name="target_group"
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
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('scopes.groups.name')}
                id="group-field-target"
                disabled={loading || disabled}
                error={!!fieldState.error}
                helperText={<span id="group-error-message">{t(`${fieldState.error?.message || ''}`)}</span>}
                slotProps={{
                  inputLabel: {
                    id: 'group-field-target-label',
                    htmlFor: 'group-field-target',
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

export default GroupField;
