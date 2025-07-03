import AppIconButton from '@/components/AppIconButton';
import { IconButtonProps } from '@mui/material';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends IconButtonProps {
  onEdit: () => void;
}

const EditButton = forwardRef<HTMLButtonElement, Props>(
  ({ disabled = false, onEdit, ...restOfProps }, ref) => {
    const { t } = useTranslation();
    return (
      <AppIconButton
        ref={ref}
        icon="edit"
        title={t('tooltips.edit')}
        disabled={disabled}
        aria-label={t('actions.edit')}
        {...restOfProps}
        onClick={onEdit}
      />
    );
  }
);

export default EditButton;
