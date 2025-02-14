import { getIdeasByRoom } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { SelectOptionsType, UpdateType } from '@/types/SettingsTypes';
import { Autocomplete, BaseTextFieldProps, CircularProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  room: string;
  defaultValues: IdeaType[];
  hasError?: boolean;
  disabled?: boolean;
  onChange: (updates: UpdateType) => void;
}

/**
 * Renders "IdeaField" component
 */

const IdeaField: React.FC<Props> = ({
  room,
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

  const fetchIdeas = async () => {
    setLoading(true);
    const response = await getIdeasByRoom(room);
    setLoading(false);
    const wildIdeas = response.data?.map((idea) => ({ label: idea.title, value: idea.hash_id })) || [];
    const boxIdeas = defaultValues.map((idea) => ({ label: idea.title, value: idea.hash_id }));
    const options = wildIdeas.concat(boxIdeas);
    setOptions(options);
  };

  const handleChange = (selected: SelectOptionsType) => {
    setSelectedOptions(selected);
    const selectedValues = selected.map((option) => String(option.value));
    const defaultIds = defaultValues.map((idea) => idea.hash_id);
    onChange({
      add: selectedValues.filter((value) => !defaultIds.includes(value)),
      remove: defaultIds.filter((value) => !selectedValues.includes(value)),
    });
  };

  useEffect(() => {
    if (options.length > 0) {
      const defaultIds = defaultValues.map((idea) => idea.hash_id);
      const filtered = options.filter((option) => defaultIds.includes(String(option.value)));
      setSelectedOptions(filtered);
    }
  }, [options, defaultValues]);

  useEffect(() => {
    fetchIdeas();
  }, [defaultValues, room]);

  return (
    <Autocomplete
      multiple
      fullWidth
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={(_, value) => handleChange(value)}
      value={selectedOptions}
      noOptionsText={t('forms.validation.noOptions')}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => option.label}
      options={options}
      loading={loading}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('scopes.ideas.plural')}
          disabled={disabled || options.length === 0}
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

export default IdeaField;
