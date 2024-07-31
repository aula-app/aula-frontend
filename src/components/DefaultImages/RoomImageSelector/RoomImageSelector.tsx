import AppButton from '@/components/AppButton';
import DefaultImage from '@/components/DefaultImages';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onClose: () => void;
  onSubmit: (image: string) => void;
}

const RoomImageSelector = ({ onClose, onSubmit }: Props) => {
  const { t } = useTranslation();
  const [shift, setShift] = useState(0);
  const [selected, setSelected] = useState(0);
  return (
    <Stack p={2}>
      <Typography variant="h6">Change color</Typography>
      <Stack direction="row" width="100%" justifyContent="space-between" py={2}>
        {[...Array(8)].map((item, key) => (
          <Button
            key={key}
            sx={{
              width: 50,
              aspectRatio: 1,
              minWidth: 'auto',
              maxWidth: '10%',
              borderRadius: 999,
              bgcolor: `hsl(${122 - key * 45}, 50%, 75%)`,
            }}
            onClick={() => setShift(key * 45)}
          ></Button>
        ))}
      </Stack>
      <Typography variant="h6">Select image</Typography>
      <Grid container spacing={2}>
        {[...Array(8)].map((item, key) => (
          <Grid item xs={6} sm={3} key={`img_${key}`}>
            <Button
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                border: selected === key ? 2 : 0,
                borderRadius: 6,
                // maxWidth: 200,
                mx: 'auto',
              }}
              onClick={() => setSelected(key)}
            >
              <DefaultImage image={key} shift={shift} />
            </Button>
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" width="100%" justifyContent="end" py={2}>
        <Button color="error" sx={{ mr: 2 }} onClick={onClose}>
          {t('generics.cancel')}
        </Button>
        <AppButton color="primary" onClick={() => onSubmit(`DI:${selected}:${shift}`)}>
          {t('generics.confirm')}
        </AppButton>
      </Stack>
    </Stack>
  );
};

export default RoomImageSelector;
