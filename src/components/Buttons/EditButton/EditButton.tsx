import AppIconButton from '@/components/AppIconButton';
import { IconButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props extends IconButtonProps {
  onEdit: () => void;
  /**
   * The type of item being edited, used for accessibility label
   * e.g., "idea", "comment", "profile", etc.
   */
  itemType?: string;
}

const EditButton: React.FC<Props> = ({ 
  disabled = false, 
  onEdit, 
  itemType = 'item',
  ...restOfProps 
}) => {
  const { t } = useTranslation();
  
  // Create descriptive accessibility label
  const ariaLabel = t('accessibility.aria.editItem', { item: t(`scopes.${itemType}.name`, itemType) });
  
  return (
    <AppIconButton 
      icon="edit" 
      disabled={disabled} 
      onClick={onEdit} 
      aria-label={ariaLabel}
      title={ariaLabel}
      {...restOfProps} 
    />
  );
};

export default EditButton;
