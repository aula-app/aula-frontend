import { Dialog } from '@mui/material';
import RoomImageSelector from '../DefaultImages/RoomImageSelector/RoomImageSelector';

interface NewCommentProps {
  currentImage: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (image: string) => void;
}

const ImageSelector = ({ currentImage, isOpen, onClose, onSubmit }: NewCommentProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <RoomImageSelector onSubmit={onSubmit} onClose={onClose} />
    </Dialog>
  );
};

export default ImageSelector;
