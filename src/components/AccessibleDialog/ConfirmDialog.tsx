import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AccessibleDialog from './AccessibleDialog';

export interface ConfirmDialogProps {
  /**
   * The title of the confirmation dialog
   */
  title: string;
  
  /**
   * The message to display in the dialog
   */
  message: string | React.ReactNode;
  
  /**
   * Text for the confirm button
   * @default 'Confirm'
   */
  confirmText?: string;
  
  /**
   * Text for the cancel button
   * @default 'Cancel'
   */
  cancelText?: string;
  
  /**
   * Color for the confirm button
   * @default 'primary'
   */
  confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  
  /**
   * Whether the dialog is open
   */
  open: boolean;
  
  /**
   * Whether the confirm action is currently loading/processing
   */
  isLoading?: boolean;
  
  /**
   * Function called when the confirm button is clicked
   */
  onConfirm: () => void | Promise<void>;
  
  /**
   * Function called when the cancel button is clicked
   */
  onCancel: () => void;
  
  /**
   * Optional test ID for testing
   */
  testId?: string;
}

/**
 * An accessible confirmation dialog component that follows WAI-ARIA best practices
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmText,
  cancelText,
  confirmColor = 'primary',
  open,
  isLoading: externalIsLoading,
  onConfirm,
  onCancel,
  testId,
}) => {
  const { t } = useTranslation();
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;
  
  // Create references for keyboard navigation
  const cancelButtonRef = React.useRef<HTMLButtonElement>(null);
  const confirmButtonRef = React.useRef<HTMLButtonElement>(null);
  
  // Handle confirm button click
  const handleConfirm = async () => {
    try {
      setInternalIsLoading(true);
      await Promise.resolve(onConfirm());
    } finally {
      setInternalIsLoading(false);
    }
  };
  
  // Determine button text
  const confirmButtonText = confirmText || t('actions.confirm');
  const cancelButtonText = cancelText || t('actions.cancel');
  
  return (
    <AccessibleDialog
      open={open}
      title={title}
      onClose={onCancel}
      initialFocusRef={cancelButtonRef}
      finalFocusRef={confirmButtonRef}
      maxWidth="xs"
      testId={testId}
      description={t('ui.accessibility.pressToContinue')}
      actions={
        <>
          <Button
            ref={cancelButtonRef}
            onClick={onCancel}
            color="inherit"
            disabled={isLoading}
            aria-label={cancelButtonText}
          >
            {cancelButtonText}
          </Button>
          <Button
            ref={confirmButtonRef}
            onClick={handleConfirm}
            color={confirmColor}
            variant="contained"
            disabled={isLoading}
            aria-label={isLoading ? t('actions.processing') : confirmButtonText}
          >
            {isLoading ? t('actions.processing') : confirmButtonText}
          </Button>
        </>
      }
    >
      <Box sx={{ py: 1 }}>
        {typeof message === 'string' ? (
          <Typography variant="body1">{message}</Typography>
        ) : (
          message
        )}
      </Box>
    </AccessibleDialog>
  );
};

export default ConfirmDialog;