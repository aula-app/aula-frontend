import DefaultImage from '@/components/DefaultImages';
import { Button, Dialog, DialogProps, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RoomImageSelectorProps {
  image: string;
  onClose: () => void;
  onSubmit: (image: string) => void;
}

/**
 * Parses the description_internal field to determine if it's a default image
 * @param description - The description_internal string from the room
 */
const parseDescription = (description: string) => {
  if (!description || !description.startsWith('DI:')) {
    return { image: 0, shift: 0 };
  }

  const [, imageNum = 0, shift = 0] = description.split(':');
  return {
    image: Number(imageNum),
    shift: Number(shift),
  };
};

const RoomImageSelector: FC<RoomImageSelectorProps> = ({ image, onClose, onSubmit }) => {
  const { t } = useTranslation();

  const [currentImage, setCurrentImage] = useState(parseDescription(image));
  const [selected, setSelected] = useState(currentImage.image || 0);
  const [shift, setShift] = useState(currentImage.shift || 0);
  const [editImage, setEditImage] = useState(false);

  const handleClose = () => {
    setEditImage(false);
    onReset();
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(`DI:${selected}:${shift}`);
    setEditImage(false);
  };

  const onReset = () => {
    setCurrentImage(parseDescription(image));
  };

  useEffect(() => {
    setSelected(currentImage.image || 0);
    setShift(currentImage.shift || 0);
  }, [currentImage]);

  useEffect(() => {
    onReset();
  }, [image]);

  return (
    <>
      <Button sx={{ minWidth: `min(300px, 100%)`, maxWidth: 500, mx: 'auto' }} onClick={() => setEditImage(true)}>
        <DefaultImage image={selected} shift={shift} />
      </Button>
      <Dialog open={editImage} onClose={() => setEditImage(false)} fullWidth>
        <Stack p={2}>
          <Typography variant="h3">Change color</Typography>
          <Stack direction="row" width="100%" justifyContent="space-between" py={2}>
            {[...Array(8)].map((_, key) => (
              <Button
                key={key}
                sx={{
                  width: 50,
                  aspectRatio: 1,
                  minWidth: 'auto',
                  maxWidth: '10%',
                  borderRadius: 999,
                  bgcolor: `hsl(${122 + key * 45}, 50%, 75%)`,
                }}
                onClick={() => setShift(key * 45)}
                aria-label={t('room.image.color', { number: key + 1 })}
              >
                <span aria-hidden="true"></span>
              </Button>
            ))}
          </Stack>
          <Typography variant="h3">Select image</Typography>
          <Grid container spacing={2}>
            {[...Array(8)].map((_, key) => (
              <Grid size={{ xs: 6, sm: 3 }} key={`img_${key}`}>
                <Button
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    border: selected === key ? 2 : 0,
                    borderRadius: 6,
                    mx: 'auto',
                  }}
                  onClick={() => setSelected(key)}
                  aria-label={t('room.image.pattern', { number: key + 1 })}
                >
                  <DefaultImage image={key} shift={shift} />
                </Button>
              </Grid>
            ))}
          </Grid>
          <Stack direction="row" width="100%" justifyContent="end" py={2}>
            <Button color="error" sx={{ mr: 2 }} onClick={handleClose}>
              {t('actions.cancel')}
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              {t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default RoomImageSelector;
