import AppIconButton from '@/components/AppIconButton';
import { IconButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props extends IconButtonProps {
  onEdit: () => void;
}

const EditButton: React.FC<Props> = ({ disabled = false, onEdit, ...restOfProps }) => {
  const { t } = useTranslation();
  return (
    <AppIconButton icon="edit" title={t('tooltips.edit')} disabled={disabled} aria-label={t('actions.edit')} {...restOfProps} onClick={onEdit} />
  );
};

export default EditButton;
