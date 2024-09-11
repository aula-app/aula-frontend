import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import DefaultImage from '@/components/DefaultImages';
import ImageSelector from '@/components/ImageSelector/ImageSelector';
import { InputSettings } from '@/utils/Data';
import { Button, FormControl, FormHelperText, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

type Props = {
  data: InputSettings;
  control: Control<{}, any>;
  disabled?: boolean;
  setValue: UseFormSetValue<{}>;
};

/**
 * Renders "SelectInput" component
 */

const ImageField = ({ data, control, disabled = false, setValue, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  const [selector, setSelector] = useState(false);
  const onSubmit = (field: string, image: string) => {
    // @ts-ignore
    setValue(field, image);
    setSelector(false);
  };
  return (
    <Controller
      // @ts-ignore
      name={data.name}
      control={control}
      // @ts-ignore
      defaultValue={data.form.defaultValue}
      render={({ field, fieldState }) => {
        const value = String(field.value);
        return (
          <FormControl fullWidth>
            <Typography variant="caption" pl={2}>
              {t('generics.image')}
            </Typography>
            <TextField {...field} {...restOfProps} sx={{ visibility: 'hidden', height: 0 }} />
            {value === '' ? (
              <AppButton variant="outlined" onClick={() => setSelector(true)} sx={{ mt: 2 }}>
                {t('texts.add', { var: t('generics.image').toLowerCase() })}
              </AppButton>
            ) : (
              <Stack direction="row" justifyContent="center">
                <Button onClick={() => setSelector(true)} sx={{ position: 'relative', width: 300 }}>
                  <AppIcon icon="edit" sx={{ position: 'absolute', top: 0, right: 0 }} />
                  {value.substring(0, 3) === 'DI:' ? (
                    <DefaultImage image={Number(value.split(':')[1])} shift={Number(value.split(':')[2])} />
                  ) : (
                    <img src={field.value} />
                  )}
                </Button>
              </Stack>
            )}
            <ImageSelector
              currentImage={field.value}
              isOpen={selector}
              onClose={() => setSelector(false)}
              onSubmit={(image) => onSubmit(field.name, image)}
            />
            <FormHelperText error={!!fieldState.error}>{t(fieldState.error?.message || ' ')}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default ImageField;
