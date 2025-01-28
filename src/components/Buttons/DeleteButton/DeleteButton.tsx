import AppIconButton from '@/components/AppIconButton';
import { IconButtonProps } from '@mui/material';

interface Props extends IconButtonProps {}

const DeleteButton: React.FC<Props> = ({ disabled = false, ...restOfProps }) => {
  return <AppIconButton icon="delete" disabled={disabled} {...restOfProps} />;
};

export default DeleteButton;
