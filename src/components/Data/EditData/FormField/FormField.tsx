import { RoomPhases } from '@/types/SettingsTypes';
import { InputSettings } from '@/utils/Data/formDefaults';
import { TextField } from '@mui/material';
import {
  Control,
  Controller,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import CustomField from './fields/CustomField';
import DurationField from './fields/DurationField';
import IconField from './fields/IconField';
import ImageField from '../../DataFields/ImageField';
import MessageTarget from './fields/MessageTarget';
import PhaseSelectField from './fields/PhaseSelectField';
import SelectField from './fields/SelectField';
import SingleDurationField from './fields/SingleDurationField';
import { ObjectPropByName } from '@/types/Generics';

type Props = {
  data: InputSettings;
  control: Control<{}, any>;
  disabled?: boolean;
  hidden?: boolean;
  register: UseFormRegister<ObjectPropByName>;
  getValues: UseFormGetValues<ObjectPropByName>;
  setValue: UseFormSetValue<ObjectPropByName>;
  setError: UseFormSetError<ObjectPropByName>;
  clearErrors: UseFormClearErrors<ObjectPropByName>;
  phase?: RoomPhases;
  isNew: boolean;
};

/**
 * Renders "FormField" component
 */

const FormField = ({
  data,
  register,
  getValues,
  setValue,
  setError,
  clearErrors,
  control,
  disabled = false,
  hidden = false,
  phase = 0,
  isNew,
  ...restOfProps
}: Props) => {
  const { t } = useTranslation();

  switch (data.form.type) {
    case 'custom':
      return <CustomField data={data} control={control} setValue={setValue} {...restOfProps} />;
    case 'duration':
      return (
        <DurationField
          data={data}
          control={control}
          setValue={setValue}
          getValues={getValues}
          setError={setError}
          clearErrors={clearErrors}
          {...restOfProps}
        />
      );
    case 'icon':
      return <IconField data={data} control={control} setValue={setValue} {...restOfProps} />;
    case 'image':
      return <ImageField data={data} control={control} setValue={setValue} {...restOfProps} />;
    case 'select':
      return <SelectField data={data} control={control} disabled={disabled} {...restOfProps} />;
    case 'singleDuration':
      return <SingleDurationField data={data} control={control} setValue={setValue} {...restOfProps} />;
    case 'phaseSelect':
      return <PhaseSelectField data={data} control={control} phase={phase} disabled={disabled} {...restOfProps} />;
    case 'target':
      return (
        <MessageTarget
          data={data}
          control={control}
          disabled={!isNew}
          setValue={setValue}
          getValues={getValues}
          {...restOfProps}
        />
      );
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
              label={t(`settings.columns.${data.name}`)}
              required={data.required}
              minRows={data.form.type === 'text' ? 4 : 1}
              multiline={data.form.type === 'text'}
              disabled={disabled}
              type={data.form.type}
              fullWidth
              {...field}
              error={!!fieldState.error}
              helperText={t(fieldState.error?.message || ' ')}
              slotProps={{ inputLabel: { shrink: !!field.value } }}
              {...restOfProps}
            />
          )}
        />
      );
  }
};

export default FormField;
