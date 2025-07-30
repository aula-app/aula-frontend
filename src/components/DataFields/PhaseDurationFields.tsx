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

const SYSTEM_DEFAULT_DURATION = 14; // Default duration in days if not specified

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

  const [error, setError] = useState<string>();

  const fields = [
    { name: 'phase_duration_1', phase: 10 },
    { name: 'phase_duration_3', phase: 30 },
  ] as Array<{ name: 'phase_duration_1' | 'phase_duration_3'; phase: RoomPhases }>;

  const getDurations = () => {
    fields.forEach((field) => {
      if (control._defaultValues[field.name]) return; // Skip if already set
      setValue(field.name, getDefaultDuration(field.name));
    });
  };

  const getDefaultDuration = async (phase: 'phase_duration_1' | 'phase_duration_3') => {
    const id = room || room_id;
    return id
      ? await getRoom(id).then((response) => {
          if (response.data && response.data[phase]) return response.data[phase]; // Default value if not found
          return SYSTEM_DEFAULT_DURATION;
        })
      : await getDefaultDurations().then((response) => {
          const currentPhase = fields.find((f) => f.name === phase)?.phase;
          if (response.data && currentPhase && response.data[currentPhase]) return response.data[currentPhase];
          return SYSTEM_DEFAULT_DURATION;
        });
  };

  useEffect(() => {
    getDurations();
  }, [room, room_id]);

  return (
    <Stack
      sx={{
        position: 'relative',
        border: '1px solid rgba(0,0,0,.25)',
        borderRadius: 1,
        minHeight: 56,
        minWidth: 'min(250px, 100%)',
        flex: 1,
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
      <Stack direction="row" flexWrap="wrap" alignItems="center" px={2} gap={2}>
        {fields.map((field) => (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: fieldProps, fieldState }) => {
              if (fieldState.error) setError(fieldState.error.message);
              return (
                <FormControl sx={{ flex: 1, minWidth: '100px' }}>
                  <TextField
                    label={t(`settings.columns.${field.name}`)}
                    type="number"
                    size="small"
                    variant="standard"
                    required={required}
                    disabled={disabled}
                    {...fieldProps}
                    error={!!fieldState.error}
                    {...restOfProps}
                    slotProps={{
                      input: { endAdornment: <InputAdornment position="end">{t('ui.units.days')}</InputAdornment> },
                      inputLabel: { shrink: true },
                      htmlInput: {
                        min: 1,
                        max: 365,
                        step: 1,
                      },
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
