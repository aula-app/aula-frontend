import AppIconButton from '@/components/AppIconButton';
import { SettingNamesType } from '@/types/SettingsTypes';
import { WarningAmber } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButtonProps,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends IconButtonProps {
  scope: SettingNamesType;
  onDelete: () => void;
}

const DeleteButton: React.FC<Props> = ({ scope, disabled = false, onDelete, ...restOfProps }) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setOpen(false);
  };

  const onClose = () => setOpen(false);

  // Generate unique dialog IDs for accessibility
  const dialogId = `delete-dialog-${scope}`;
  const titleId = `delete-dialog-title-${scope}`;
  const descriptionId = `delete-dialog-description-${scope}`;
  
  // Prepare translated label for delete button
  const deleteButtonLabel = t('accessibility.aria.deleteItem', { item: t(`scopes.${scope}.name`) });

  return (
    <>
      <AppIconButton 
        icon="delete" 
        disabled={disabled} 
        {...restOfProps} 
        onClick={() => setOpen(true)}
        aria-label={deleteButtonLabel}
        aria-haspopup="dialog"
        aria-controls={isOpen ? dialogId : undefined}
      />
      <Dialog
        id={dialogId}
        open={isOpen}
        onClose={onClose}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        role="alertdialog" // Use alertdialog role for critical/destructive actions
      >
        <DialogTitle id={titleId}>
          <Stack direction="row" alignItems="center">
            <WarningAmber sx={{ mr: 1 }} color="error" aria-hidden="true" /> 
            {t('deletion.headline', { var: t(`scopes.${scope}.name`) })}
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id={descriptionId}>
            {t('deletion.confirm', { var: t(`scopes.${scope}.name`) })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={onClose} 
            color="secondary" 
            autoFocus
            aria-label={t('accessibility.aria.cancelAction')}
          >
            {t('actions.cancel')}
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            aria-label={t('accessibility.aria.deleteItem', { item: t(`scopes.${scope}.name`) })}
          >
            {t('actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteButton;
