import { ConfirmDialog } from '@/components';
import AppIconButton from '@/components/AppIconButton';
import { SettingNamesType } from '@/types/SettingsTypes';
import { WarningAmber } from '@mui/icons-material';
import { IconButtonProps, Stack, Typography } from '@mui/material';
import { forwardRef, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends IconButtonProps {
  scope: SettingNamesType;
  onDelete: () => void;
  /**
   * Whether the delete operation is currently loading
   */
  isLoading?: boolean;
}

/**
 * Accessible delete button with confirmation dialog
 */
const DeleteButton = forwardRef<HTMLButtonElement, Props>(
  ({ scope, disabled = false, onDelete, isLoading = false, ...restOfProps }, ref) => {
    const { t } = useTranslation();
    const [isOpen, setOpen] = useState(false);

    const handleDelete = () => {
      onDelete();
      setOpen(false);
    };

    const onClose = () => setOpen(false);

    // Create confirmation message with icon
    const confirmationMessage = (
      <Stack spacing={2}>
        <Typography variant="body1">{t('deletion.confirm', { var: t(`scopes.${scope}.name`) })}</Typography>
      </Stack>
    );

    return (
      <>
        <AppIconButton
          ref={ref}
          icon="delete"
          title={t('tooltips.delete')}
          disabled={disabled || isLoading}
          aria-label={t('actions.delete', { var: t(`scopes.${scope}.name`) })}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          {...restOfProps}
          onClick={() => setOpen(true)}
        />
        <ConfirmDialog
          open={isOpen}
          title={t('deletion.headline', { var: t(`scopes.${scope}.name`) })}
          message={confirmationMessage}
          confirmText={t('actions.delete')}
          confirmColor="error"
          onConfirm={handleDelete}
          onCancel={onClose}
          isLoading={isLoading}
          testId="delete-confirmation-dialog"
        />
      </>
    );
  }
);

export default DeleteButton;
