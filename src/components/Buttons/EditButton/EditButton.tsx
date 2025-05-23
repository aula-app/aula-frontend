import AppIconButton from '@/components/AppIconButton';
import { IconButtonProps } from '@mui/material';

interface Props extends IconButtonProps {
  onEdit: () => void;
}

const EditButton: React.FC<Props> = ({ disabled = false, onEdit, ...restOfProps }) => {
  return <AppIconButton icon="edit" disabled={disabled} {...restOfProps} onClick={onEdit} />;
};

export default EditButton;
