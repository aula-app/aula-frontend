import { Upload, ZoomIn, ZoomOut } from '@mui/icons-material';
import { Button, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { createUseGesture, pinchAction } from '@use-gesture/react';
import { ChangeEvent, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import AppButton from '../AppButton';

const useGesture = createUseGesture([pinchAction]);

interface NewCommentProps {
  closeMethod: () => void;
  isOpen: boolean;
  currentImage: string;
}

export const ImageEditor = ({ closeMethod, isOpen, currentImage }: NewCommentProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <Drawer anchor="bottom" open={isOpen} onClose={closeMethod}>
      <Stack p={2}>
        <Typography variant="h5" pb={2}>
          Edit avatar image
        </Typography>
        <input type="file" id="file" accept="image/*" hidden onChange={handleFileChange} />
        <label htmlFor="file">
          <Button variant="outlined" color="secondary" fullWidth component="span">
            <Upload sx={{ mr: 1 }} />
            {image ? 'Change Image' : 'Upload Image'}
          </Button>
        </label>
        <Stack pt={2} alignItems="center" overflow="clip" ref={ref}>
          <AvatarEditor
            image={image || currentImage}
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
        <Stack direction="row">
          <Button color="secondary" onClick={closeMethod} sx={{ mr: 'auto' }}>
            Cancel
          </Button>
          <AppButton color="primary">Submit</AppButton>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default ImageEditor;
