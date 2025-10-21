import { getRooms } from '@/services/rooms';
import { SelectOptionsType, UpdateType } from '@/types/SettingsTypes';
import { Autocomplete, BaseTextFieldProps, CircularProgress, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  selected: UpdateType;
  disabled?: boolean;
  onChange: (updates: UpdateType) => void;
}

/**
 * Renders "RoomField" component
 */

const RoomField: React.FC<Props> = ({ selected, onChange, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<SelectOptionsType>([]);
  const [selectedOptions, setSelectedOptions] = useState<SelectOptionsType>([]);

  const fetchRooms = async () => {
    setLoading(true);
    const response = await getRooms();
    setLoading(false);
    if (!response.data) return;
    const rooms = response.data.map((room) => ({ label: room.room_name, value: room.hash_id }));
    setOptions(rooms);
  };

  const handleChange = (selectedOptions: SelectOptionsType) => {
    setSelectedOptions(selectedOptions);
    const selectedValues = selectedOptions.map((option) => String(option.value));

    // Always update with the complete list of selected values
    onChange({ add: selectedValues, remove: [] });
  };

  useEffect(() => {
    if (options.length > 0) {
      // If selected.add is empty, clear the selection
      if (selected.add.length === 0 && selected.remove.length === 0) {
        setSelectedOptions([]);
      } else {
        const filtered = options.filter((option) => selected.add.includes(String(option.value)));
        setSelectedOptions(filtered);
      }
    }
  }, [options, selected]);

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <Autocomplete
      multiple
      fullWidth
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={(_, value) => handleChange(value)}
      data-testid="user-room-select"
      value={selectedOptions}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => option.label}
      options={options}
      loading={loading}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('scopes.rooms.plural')}
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

export default RoomField;
