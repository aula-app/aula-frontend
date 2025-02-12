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

  return (
    <>
      <AppIconButton icon="delete" disabled={disabled} {...restOfProps} onClick={() => setOpen(true)} />
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Stack direction="row" alignItems="center">
            <WarningAmber sx={{ mr: 1 }} color="error" /> {t('deletion.headline', { var: t(`scopes.${scope}.name`) })}
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {t('deletion.confirm', { var: t(`scopes.${scope}.name`) })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" autoFocus>
            {t('actions.cancel')}
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            {t('actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteButton;
