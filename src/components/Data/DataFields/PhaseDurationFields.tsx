import { getRoom } from '@/services/rooms';
import { FormControl, FormHelperText, FormLabel, InputAdornment, Stack, TextField, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface Props {
  control: Control<any, any>;
  disabled?: boolean;
  onChange?: (...event: any[]) => void;
}

/**
 * Renders "PhaseDurationFields" component
 */

const PhaseDurationFields: React.FC<Props> = ({ control, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { room_id } = useParams();

  const [error, setError] = useState<string>();
  const [durations, setDurations] = useState<number[]>([]);

  const fields = ['phase_duration_1', 'phase_duration_2', 'phase_duration_3', 'phase_duration_4'] as Array<
    'phase_duration_1' | 'phase_duration_2' | 'phase_duration_3' | 'phase_duration_4'
  >;

  const getDurations = () => {
    if (!room_id) return;
    getRoom(room_id).then((response) => {
      setDurations(
        fields.map((field) => {
          if (!response.data || !(field in response.data)) return 0;
          return response.data[field];
        })
      );
    });
  };

  useEffect(() => {
    getDurations();
  }, []);

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
        {fields.map((name, i) => (
          <Controller
            key={name}
            name={name}
            control={control}
            defaultValue={control._defaultValues.status || durations[i]}
            render={({ field, fieldState }) => {
              if (!!fieldState.error) setError(fieldState.error.message);
              return (
                <FormControl sx={{ flex: 1, minWidth: 'min(150px, 100%)' }}>
                  <TextField
                    label={t(`settings.columns.${name}`)}
                    type="number"
                    size="small"
                    variant="standard"
                    {...field}
                    error={!!fieldState.error}
                    {...restOfProps}
                    slotProps={{
                      input: { endAdornment: <InputAdornment position="end">{t('ui.units.days')}</InputAdornment> },
                      inputLabel: { shrink: !!field.value },
                    }}
                  />
                </FormControl>
              );
            }}
          />
        ))}
      </Stack>
      <FormHelperText error={!!error}>{t(error || ' ')}</FormHelperText>
    </Stack>
  );
};

export default PhaseDurationFields;
