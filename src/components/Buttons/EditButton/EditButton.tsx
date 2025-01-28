import AppIconButton from '@/components/AppIconButton';
import { IconButtonProps } from '@mui/material';

interface Props extends IconButtonProps {}

const EditButton: React.FC<Props> = ({ disabled = false, ...restOfProps }) => {
  return <AppIconButton icon="edit" disabled={disabled} {...restOfProps} />;
};

export default EditButton;
