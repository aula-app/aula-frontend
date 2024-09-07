import { Stack, TextField, Typography } from '@mui/material';
import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import SelectField from './fields/SelectField';
import ImageField from './fields/ImageField';
import IconField from './fields/IconField';
import { InputSettings } from '../EditData/DataConfig';
import PhaseSelectField from './fields/PhaseSelectField';
import { RoomPhases } from '@/types/SettingsTypes';
import DurationField from './fields/DurationField';

type Props = {
  data: InputSettings;
  control: Control<{}, any>;
  disabled?: boolean;
  hidden?: boolean;
  register: UseFormRegister<{}>;
  getValues: () => void;
  setValue: UseFormSetValue<{}>;
  errors: FieldErrors<{}>;
  phase?: RoomPhases;
};

/**
 * Renders "FormInput" component
 */

const FormInput = ({
  data,
  register,
  getValues,
  setValue,
  control,
  errors,
  disabled = false,
  hidden = false,
  phase = 0,
  ...restOfProps
}: Props) => {
  const { t } = useTranslation();

  switch (data.form.type) {
    case 'duration':
      return <DurationField data={data} control={control} setValue={setValue} {...restOfProps} />;
    case 'icon':
      return <IconField data={data} control={control} setValue={setValue} {...restOfProps} />;
    case 'image':
      return <ImageField data={data} control={control} setValue={setValue} {...restOfProps} />;
    case 'select':
      return <SelectField data={data} control={control} disabled={disabled} {...restOfProps} />;
    case 'phaseSelect':
      return <PhaseSelectField data={data} control={control} phase={phase} disabled={disabled} {...restOfProps} />;
    default:
      return (
        <Controller
          // @ts-ignore
          name={data.name}
          control={control}
          // @ts-ignore
          defaultValue={data.form.defaultValue}
          // @ts-ignore
          render={({ field, fieldState }) => (
            <TextField
              label={t(`settings.${data.name}`)}
              required={data.required}
              minRows={data.form.type === 'text' ? 4 : 1}
              multiline={data.form.type === 'text'}
              disabled={disabled}
              type={data.form.type}
              fullWidth
              {...field}
              error={!!fieldState.error}
              helperText={t(fieldState.error?.message || ' ')}
              sx={hidden ? { visibility: 'hidden', height: 0 } : {}}
              slotProps={{ inputLabel: { shrink: !!field.value } }}
              {...restOfProps}
            />
          )}
        />
      );
  }
};

export default FormInput;
