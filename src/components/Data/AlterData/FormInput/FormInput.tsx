import { formsSettings } from '@/utils';
import { Stack, TextField, Typography } from '@mui/material';
import { Control, FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import SelectField from './SelectField';
import ImageField from './ImageField';

type Props = {
  form: keyof typeof formsSettings;
  control: Control<{}, any>;
  disabled?: boolean;
  hidden?: boolean;
  register: UseFormRegister<{}>;
  setValue: UseFormSetValue<{}>;
  errors: FieldErrors<{}>;
};

/**
 * Renders "FormInput" component
 */

const FormInput = ({
  form,
  register,
  setValue,
  control,
  errors,
  disabled = false,
  hidden = false,
  ...restOfProps
}: Props) => {
  const { t } = useTranslation();

  switch (formsSettings[form].type) {
    case 'select':
      return <SelectField form={form} control={control} disabled={disabled} />;
    case 'duration':
      return (
        <Stack direction="row" alignItems="center" px={1} sx={hidden ? { visibility: 'hidden', height: 0 } : {}}>
          <Typography noWrap pb={1} mr="auto">
            {t(`settings.${form}`)}:
          </Typography>
          <TextField
            required
            disabled={disabled}
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
            variant="standard"
            // @ts-ignore
            {...register(form)}
            // @ts-ignore
            error={errors[form] ? true : false}
            // @ts-ignore
            helperText={t(errors[form]?.message || ' ')}
            sx={{ mx: 2, width: 80 }}
            {...restOfProps}
            InputLabelProps={{ shrink: true }}
          />
          <Typography noWrap pb={1}>
            {t(`generics.days`)}
          </Typography>
        </Stack>
      );
    case 'image':
      return <ImageField form={form} control={control} setValue={setValue} />;
    default:
      return (
        <TextField
          label={t(`settings.${form}`)}
          required
          minRows={formsSettings[form].type === 'text' ? 4 : 1}
          multiline={formsSettings[form].type === 'text'}
          disabled={disabled}
          type={formsSettings[form].type}
          fullWidth
          // @ts-ignore
          {...register(form)}
          // @ts-ignore
          error={errors[form] ? true : false}
          // @ts-ignore
          helperText={t(errors[form]?.message || ' ')}
          sx={hidden ? { visibility: 'hidden', height: 0 } : {}}
          {...restOfProps}
          InputLabelProps={{ shrink: true }}
        />
      );
  }
};

export default FormInput;
