import DefaultImage from '@/components/DefaultImages';
import { Button, Dialog, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { set } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
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

const RoomImageSelector = ({ image, onClose, onSubmit }: Props) => {
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
  // Generate unique IDs for accessibility
  const dialogId = "room-image-selector-dialog";
  const dialogTitleId = "room-image-selector-dialog-title";
  const colorSectionId = "room-image-color-section";
  const imageSectionId = "room-image-section";
  
  // Color names for accessibility
  const getColorName = (index: number) => {
    const colorNames = [
      t('accessibility.colors.green'),
      t('accessibility.colors.teal'),
      t('accessibility.colors.blue'),
      t('accessibility.colors.purple'),
      t('accessibility.colors.magenta'),
      t('accessibility.colors.red'),
      t('accessibility.colors.orange'),
      t('accessibility.colors.yellow')
    ];
    return colorNames[index % colorNames.length];
  };
  
  // Image names for accessibility
  const getImageName = (index: number) => {
    const imageNames = [
      t('accessibility.images.airplane'),
      t('accessibility.images.beaker'),
      t('accessibility.images.cat'),
      t('accessibility.images.chair'),
      t('accessibility.images.clothing'),
      t('accessibility.images.computer'),
      t('accessibility.images.door'),
      t('accessibility.images.globe')
    ];
    return imageNames[index % imageNames.length];
  };

  return (
    <>
      <Button 
        sx={{ minWidth: `min(300px, 100%)`, maxWidth: 500, mx: 'auto' }} 
        onClick={() => setEditImage(true)}
        aria-label={t('roomImage.changeImage')}
        aria-haspopup="dialog"
      >
        <DefaultImage image={selected} shift={shift} />
      </Button>
      
      <Dialog 
        id={dialogId}
        open={editImage} 
        onClose={() => setEditImage(false)} 
        fullWidth
        aria-labelledby={dialogTitleId}
        role="dialog"
      >
        <Stack p={2}>
          <Typography variant="h3" id={dialogTitleId}>{t('roomImage.selectImageAndColor')}</Typography>
          
          {/* Color Selection Section */}
          <Typography variant="h4" id={colorSectionId}>{t('roomImage.changeColor')}</Typography>
          <Stack 
            direction="row" 
            width="100%" 
            justifyContent="space-between" 
            py={2}
            role="radiogroup"
            aria-labelledby={colorSectionId}
          >
            {[...Array(8)].map((item, key) => {
              const isSelected = shift === key * 45;
              const colorName = getColorName(key);
              
              return (
                <Button
                  key={key}
                  sx={{
                    width: 50,
                    aspectRatio: 1,
                    minWidth: 'auto',
                    maxWidth: '10%',
                    borderRadius: 999,
                    bgcolor: `hsl(${122 - key * 45}, 50%, 75%)`,
                    border: isSelected ? '3px solid black' : 'none',
                  }}
                  onClick={() => setShift(key * 45)}
                  aria-label={colorName}
                  aria-pressed={isSelected}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <span className="sr-only">{colorName}</span>
                </Button>
              );
            })}
          </Stack>
          
          {/* Image Selection Section */}
          <Typography variant="h4" id={imageSectionId}>{t('roomImage.selectImage')}</Typography>
          <Grid 
            container 
            spacing={2}
            role="radiogroup"
            aria-labelledby={imageSectionId}
          >
            {[...Array(8)].map((item, key) => {
              const isSelected = selected === key;
              const imageName = getImageName(key);
              
              return (
                <Grid size={{ xs: 6, sm: 3 }} key={`img_${key}`}>
                  <Button
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                      border: isSelected ? '2px solid black' : 'none',
                      borderRadius: 6,
                      mx: 'auto',
                    }}
                    onClick={() => setSelected(key)}
                    aria-label={imageName}
                    aria-pressed={isSelected}
                    role="radio"
                    aria-checked={isSelected}
                  >
                    <DefaultImage image={key} shift={shift} />
                    <span className="sr-only">{imageName}</span>
                  </Button>
                </Grid>
              );
            })}
          </Grid>
          
          {/* Action Buttons */}
          <Stack direction="row" width="100%" justifyContent="end" py={2}>
            <Button 
              color="error" 
              sx={{ mr: 2 }} 
              onClick={handleClose}
              aria-label={t('actions.cancel')}
            >
              {t('actions.cancel')}
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              aria-label={t('actions.confirm')}
            >
              {t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default RoomImageSelector;
