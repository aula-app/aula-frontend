import { Stack, TextField, Typography } from '@mui/material';
import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import SelectField from './fields/SelectField';
import ImageField from './fields/ImageField';
import IconField from './fields/IconField';
import { InputSettings } from '../EditData/DataConfig';

type Props = {
  data: InputSettings;
  control: Control<{}, any>;
  disabled?: boolean;
  hidden?: boolean;
  register: UseFormRegister<{}>;
  getValues: () => void;
  setValue: UseFormSetValue<{}>;
  errors: FieldErrors<{}>;
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
  ...restOfProps
}: Props) => {
  const { t } = useTranslation();

  switch (data.form.type) {
    case 'duration':
      return (
        <Stack direction="row" alignItems="center" px={1} sx={hidden ? { visibility: 'hidden', height: 0 } : {}}>
          <Typography noWrap pb={1} mr="auto">
            {t(`settings.${data.form.type}`)}:
          </Typography>
          <TextField
            required
            disabled={disabled}
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
            variant="standard"
            // @ts-ignore
            {...register(data.name)}
            // @ts-ignore
            error={errors[data.name] ? true : false}
            // @ts-ignore
            helperText={t(errors[data.name]?.message || ' ')}
            sx={{ mx: 2, width: 80 }}
            {...restOfProps}
            InputLabelProps={{ shrink: true }}
          />
          <Typography noWrap pb={1}>
            {t(`generics.days`)}
          </Typography>
        </Stack>
      );
    case 'icon':
      return <IconField data={data} control={control} setValue={setValue} />;
    case 'image':
      return <ImageField data={data} control={control} setValue={setValue} />;
    case 'select':
      return <SelectField data={data} control={control} disabled={disabled} />;
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
              required
              minRows={data.form.type === 'text' ? 4 : 1}
              multiline={data.form.type === 'text'}
              disabled={disabled}
              type={data.form.type}
              fullWidth
              {...field}
              error={!!fieldState.error}
              helperText={t(fieldState.error?.message || ' ')}
              sx={hidden ? { visibility: 'hidden', height: 0 } : {}}
              {...restOfProps}
              InputLabelProps={{ shrink: !!field.value }}
            />
          )}
        />
      );
  }
};

export default FormInput;
