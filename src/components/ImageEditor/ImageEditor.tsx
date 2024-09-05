import { Upload, ZoomIn, ZoomOut } from '@mui/icons-material';
import { Button, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { createUseGesture, pinchAction } from '@use-gesture/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { databaseRequest, localStorageGet } from '@/utils';
import AvatarEditor from 'react-avatar-editor';
import AppButton from '../AppButton';
import { useTranslation } from 'react-i18next';

const useGesture = createUseGesture([pinchAction]);

interface NewCommentProps {
  closeMethod: () => void;
  isOpen: boolean;
  id: number;
}

export const ImageEditor = ({ closeMethod, isOpen, id }: NewCommentProps) => {
  const { t } = useTranslation();
  const [image, setImage] = useState<string>();
  const [scale, setScale] = useState(1);

  const jwt_token = localStorageGet('token');
  const ref = useRef<HTMLDivElement>(null);
  const avatarEditor = useRef<AvatarEditor>(null);
  const imageUpload = useRef<HTMLInputElement>(null);

  const downloadUserAvatar = () => {
    databaseRequest({
      model: 'Media',
      method: 'userAvatar',
      arguments: {
        user_id: id,
      },
    }).then((response) => {
      if (response.success && response.data && response.data.length > 0)
        setImage(`${import.meta.env.VITE_APP_API_URL}/files/${response.data[0].filename}`);
    });
  };

  useGesture(
    {
      onPinch: ({ offset: [s] }) => {
        setScale(s);
      },
    },
    {
      target: ref,
      pinch: { scaleBounds: { min: 1, max: 2 }, rubberband: true },
    }
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const url = URL.createObjectURL(event.target.files[0]);
    setImage(url);
  };

  const uploadImage = () => {
    if (!avatarEditor.current) return;
    const canvasScaled = avatarEditor.current.getImageScaledToCanvas();

    canvasScaled.toBlob((blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append('file', blob, 'newfile.png');
      formData.append('fileType', 'avatar');

      // Post via axios or other transport method
      fetch(`${import.meta.env.VITE_APP_API_URL}/api/controllers/upload.php`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + jwt_token,
        },
        body: formData,
      }).then(onClose);
    });
  };

  const onClose = () => {
    closeMethod();
  };

  useEffect(() => {
    downloadUserAvatar();
  }, []);

  return (
    <Drawer anchor="bottom" open={isOpen} onClose={onClose}>
      <Stack p={2}>
        <Typography variant="h5" pb={2}>
          {t('texts.edit', { var: t('generics.image') })}
        </Typography>
        <input ref={imageUpload} type="file" id="file" accept="image/*" hidden onChange={handleFileChange} />
        <label htmlFor="file">
          <Button variant="outlined" color="secondary" fullWidth component="span">
            <Upload sx={{ mr: 1 }} />
            {image ? 'Change Image' : 'Upload Image'}
          </Button>
        </label>
        {!!image && (
          <Stack pt={2} alignItems="center" overflow="clip" ref={ref}>
            <AvatarEditor
              ref={avatarEditor}
              image={image}
              width={250}
              height={250}
              border={50}
              borderRadius={999}
              color={[255, 255, 255, 0.75]} // RGBA
              scale={scale}
            />
            <Stack direction="row">
              <IconButton onClick={() => setScale(scale - 0.2)} disabled={scale <= 1}>
                <ZoomOut />
              </IconButton>
              <IconButton onClick={() => setScale(scale + 0.2)} disabled={scale >= 3}>
                <ZoomIn />
              </IconButton>
            </Stack>
          </Stack>
        )}
        <Stack direction="row">
          <Button color="secondary" onClick={onClose} sx={{ mr: 'auto' }}>
            {t('generics.cancel')}
          </Button>
          <AppButton color="primary" onClick={uploadImage}>
            {t('generics.confirm')}
          </AppButton>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default ImageEditor;
