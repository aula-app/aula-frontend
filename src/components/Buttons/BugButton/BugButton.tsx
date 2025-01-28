import AppIconButton from '@/components/AppIconButton';
import { IconButtonProps } from '@mui/material';

interface Props extends IconButtonProps {}

const BugButton: React.FC<Props> = ({ disabled = false, ...restOfProps }) => {
  return <AppIconButton icon="bug" disabled={disabled} {...restOfProps} />;
};

export default BugButton;
