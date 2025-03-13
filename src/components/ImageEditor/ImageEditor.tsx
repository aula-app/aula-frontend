import { getAvatar, uploadImage } from '@/services/media';
import { localStorageGet } from '@/utils';
import { Box, Button, Dialog, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIconButton from '../AppIconButton';

interface Props {
  id: string;
  isOpen: boolean;
  width?: number;
  height?: number;
  onClose: () => void;
  rounded?: boolean;
}

/**
 * Renders "ImageEditor" component for uploading and cropping avatar images
 */
const ImageEditor: React.FC<Props> = ({ id, width = 200, height = 200, rounded = false, isOpen, onClose }) => {
  const { t } = useTranslation();
  const api_url = localStorageGet('api_url');

  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [zoomSize, setZoomSize] = useState({ min: 0.5, max: 3 });

  const setDefaultValues = () => {
    if (!image) return;
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
      setZoomSize({
        min: Math.min(width / img.width, height / img.height),
        max: Math.min(width / img.width, height / img.height) * 30,
      });
      setZoom(Math.max(1, Math.min(width / img.width, height / img.height)));
      setCrop({ x: 0, y: 0 });
    };
    img.src = image;
  };

  const downloadUserAvatar = async () => {
    const response = await getAvatar(id);
    if (response.data && response.data.length > 0) setImage(`${api_url}/files/${response.data[0].filename}`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX - crop.x;
    const startY = e.clientY - crop.y;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;
      setCrop({
        x:
          newX >= 0 ? 0 : newX < -imageSize.width * zoom + width ? -imageSize.width * zoom + width : e.clientX - startX,
        y:
          newY >= 0
            ? 0
            : newY < -imageSize.height * zoom + height
              ? -imageSize.height * zoom + height
              : e.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleZoom = (modifier: number) => {
    if (zoom + modifier >= zoomSize.min && zoom + modifier <= zoomSize.max) setZoom(zoom + modifier);
    setCrop({
      x:
        crop.x >= 0
          ? 0
          : crop.x < -imageSize.width * (zoom + modifier) + width
            ? -imageSize.width * (zoom + modifier) + width
            : crop.x,
      y:
        crop.y >= 0
          ? 0
          : crop.y < -imageSize.height * (zoom + modifier) + height
            ? -imageSize.height * (zoom + modifier) + height
            : crop.y,
    });
  };

  const saveImage = () => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, width, height);

      // Calculate the scaled dimensions
      const scaledWidth = img.width * zoom;
      const scaledHeight = img.height * zoom;

      // Calculate source (crop) coordinates
      const sourceX = -crop.x / zoom;
      const sourceY = -crop.y / zoom;
      const sourceWidth = width / zoom;
      const sourceHeight = height / zoom;

      // Draw the cropped and scaled portion of the image
      ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const imageFile = new File([blob], 'avatar.png', { type: 'image/png' });
          uploadImage(imageFile).then((response) => {
            if (!response.data) return;
            onClose();
          });
        }
      }, 'image/png');
    };
    img.src = image;
  };

  const handleReset = () => {
    setImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  // Set initial image if currentImage is provided
  useEffect(() => {
    downloadUserAvatar();
  }, []);

  useEffect(() => {
    setDefaultValues();
  }, [image]);
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Stack p={2} gap={2}>
        <Typography variant="h2">{t('actions.edit', { var: t('ui.files.image.label') })}</Typography>
        <Stack direction="row" justifyContent="center">
          {!image ? (
            <Paper
              sx={{
                width: width,
                height: height,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px dashed #ccc',
                borderRadius: rounded ? '100%' : undefined,
                '&:hover': {
                  border: '2px dashed #999',
                },
              }}
              onClick={() => document.getElementById('avatar-input')?.click()}
            >
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <p>{t('ui.files.image.upload')}</p>
            </Paper>
          ) : (
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  width: width,
                  height: height,
                  overflow: 'hidden',
                  position: 'relative',
                  border: '2px dashed #ccc',
                  borderRadius: rounded ? '100%' : undefined,
                }}
                onMouseDown={handleMouseDown}
              >
                <img
                  src={image}
                  style={{
                    position: 'absolute',
                    transform: `translate(${crop.x}px, ${crop.y}px) scale(${zoom})`,
                    transformOrigin: '0 0',
                    maxWidth: 'none',
                    pointerEvents: 'none',
                  }}
                  alt="Avatar preview"
                />
              </Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}
              >
                <AppIconButton icon="zoomOut" onClick={() => handleZoom(-0.1)} />
                <AppIconButton icon="cancel" onClick={handleReset} />
                <AppIconButton icon="zoomIn" onClick={() => handleZoom(0.1)} />
              </Stack>
            </Box>
          )}
        </Stack>
        <Stack direction="row" gap={2} justifyContent="end">
          <Button color="error" onClick={onClose}>
            {t('actions.cancel')}
          </Button>
          <Button variant="contained" onClick={saveImage}>
            {t('actions.confirm')}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default ImageEditor;
