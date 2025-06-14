import { getDefaultDurations } from '@/services/config';
import { getRoom } from '@/services/rooms';
import { RoomPhases } from '@/types/SettingsTypes';
import { FormControl, FormHelperText, FormLabel, InputAdornment, Stack, TextField, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface Props {
  room?: string;
  control: Control<any, any>;
  disabled?: boolean;
  required?: boolean;
  setValue: UseFormSetValue<any>;
  onChange?: (...event: any[]) => void;
}

/**
 * Renders "PhaseDurationFields" component
 */

const PhaseDurationFields: React.FC<Props> = ({
  control,
  disabled = false,
  required = false,
  room,
  setValue,
  ...restOfProps
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { room_id } = useParams();
  const [defaultDurations, setDefaultDurations] = useState<{ phase_duration_1: number; phase_duration_3: number }>({
    phase_duration_1: control._defaultValues.phase_duration_1,
    phase_duration_3: control._defaultValues.phase_duration_3,
  });

  const [error, setError] = useState<string>();

  const fields = [
    { name: 'phase_duration_1', phase: 10 },
    { name: 'phase_duration_3', phase: 30 },
  ] as Array<{ name: 'phase_duration_1' | 'phase_duration_3'; phase: RoomPhases }>;

  const getDurations = () => {
    const id = room || room_id;
    if (id) {
      getRoom(id).then((response) => {
        const updated: { phase_duration_1: number; phase_duration_3: number } = { ...defaultDurations };
        fields.forEach((field) => {
          if (response.data && field.name in response.data) {
            updated[field.name] = response.data[field.name];
            // Set the form value to ensure React Hook Form recognizes it as the default
            setValue(field.name, response.data[field.name]);
          }
        });
        setDefaultDurations(updated);
      });
    } else {
      getDefaultDurations().then((response) => {
        const updated: { phase_duration_1: number; phase_duration_3: number } = { ...defaultDurations };
        fields.forEach((field, index) => {
          if (response.data.length > 0) {
            updated[field.name] = response.data[index];
            // Set the form value to ensure React Hook Form recognizes it as the default
            setValue(field.name, response.data[index]);
          }
        });
        setDefaultDurations(updated);
      });
    }
  };

  useEffect(() => {
    getDurations();
  }, [room, room_id]);

  return (
    <Stack>
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        px={2}
        gap={2}
        sx={{
          position: 'relative',
          border: '1px solid rgba(0,0,0,.25)',
          borderRadius: 1,
          minHeight: 56,
        }}
      >
        <FormLabel
          sx={{
            position: 'absolute',
            fontSize: '1rem',
            transform: 'translate(0, -.7rem) scale(0.75)',
            transformOrigin: 'top left',
            color: 'rgba(0, 0, 0, 0.6)',
            top: 0,
            left: 10,
            backgroundColor: theme.palette.background.default,
            px: 1,
          }}
        >
          {t('settings.time.phase')}
        </FormLabel>
        {fields.map((field, i) => (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            defaultValue={control._defaultValues[field.name] || defaultDurations[field.name]}
            render={({ field: fieldProps, fieldState }) => {
              if (!!fieldState.error) setError(fieldState.error.message);
              return (
                <FormControl sx={{ flex: 1, minWidth: 'min(150px, 100%)' }}>
                  <TextField
                    label={t(`settings.columns.${field.name}`)}
                    type="number"
                    size="small"
                    variant="standard"
                    required={required}
                    disabled={disabled}
                    {...fieldProps}
                    value={fieldProps.value || defaultDurations[field.name]}
                    error={!!fieldState.error}
                    {...restOfProps}
                    slotProps={{
                      input: { endAdornment: <InputAdornment position="end">{t('ui.units.days')}</InputAdornment> },
                      inputLabel: { shrink: true },
                    }}
                  />
                </FormControl>
              );
            }}
          />
        ))}
      </Stack>
      <FormHelperText error={!!error}>{t(`${error || ''}`)}</FormHelperText>
    </Stack>
  );
};

export default PhaseDurationFields;
