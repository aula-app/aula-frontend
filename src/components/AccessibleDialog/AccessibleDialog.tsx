import { announceToScreenReader, useEscapeKey, useFocusTrap, useModalAnnouncement } from '@/utils';
import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Theme,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface AccessibleDialogProps extends Omit<DialogProps, 'title'> {
  /**
   * The title of the dialog
   */
  title: string;

  /**
   * Description of the dialog for screen readers
   */
  description?: string;

  /**
   * Whether to show a close button in the dialog title
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * The content of the dialog
   */
  children: React.ReactNode;

  /**
   * Actions to display at the bottom of the dialog
   */
  actions?: React.ReactNode;

  /**
   * Function to close the dialog
   */
  onClose: () => void;

  /**
   * Whether the dialog is open
   */
  open: boolean;

  /**
   * Element that should receive focus when the dialog is opened
   */
  initialFocusRef?: React.RefObject<HTMLElement>;

  /**
   * Element that should receive focus when the dialog is closed
   */
  finalFocusRef?: React.RefObject<HTMLElement>;

  /**
   * Additional aria attributes
   */
  ariaProps?: React.AriaAttributes;

  /**
   * Optional test ID for testing
   */
  testId?: string;
}

interface AccessibleDialogHandle {
  /**
   * Focus the dialog or a specific element within it
   */
  focus: () => void;

  /**
   * Get the dialog element
   */
  getDialogElement: () => HTMLElement | null;
}

/**
 * An accessible dialog component based on Material-UI Dialog
 * that implements WAI-ARIA dialog practices:
 * - Focus management
 * - Keyboard interaction
 * - Screen reader announcements
 */
const AccessibleDialog = forwardRef<AccessibleDialogHandle, AccessibleDialogProps>(
  (
    {
      title,
      description,
      showCloseButton = true,
      children,
      actions,
      onClose,
      open,
      initialFocusRef,
      finalFocusRef,
      ariaProps,
      testId,
      ...dialogProps
    },
    ref
  ) => {
    const { t } = useTranslation();
    const dialogRef = useRef<HTMLDivElement>(null);
    const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    // Implement handle for external control
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus();
        } else if (dialogRef.current) {
          // Find the first focusable element
          const focusableElements = dialogRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          (focusableElements[0] as HTMLElement)?.focus();
        }
      },
      getDialogElement: () => dialogRef.current,
    }));

    // Set up focus trap
    useFocusTrap(open, dialogRef, initialFocusRef, finalFocusRef);

    // Handle escape key
    useEscapeKey(open, onClose);

    // Announce dialog to screen readers
    useModalAnnouncement(open, title, t);

    // Announce dialog closure
    useEffect(() => {
      if (!open) {
        announceToScreenReader(t('ui.accessibility.dialogClosed'), 'polite');
      }
    }, [open, t]);

    // Define dialog ID for aria-labelledby and aria-describedby
    const dialogTitleId = `${title.toLowerCase().replace(/\s+/g, '-')}-dialog-title`;
    const dialogDescriptionId = description
      ? `${title.toLowerCase().replace(/\s+/g, '-')}-dialog-description`
      : undefined;

    return (
      <Dialog
        ref={dialogRef}
        open={open}
        onClose={onClose}
        aria-labelledby={dialogTitleId}
        aria-describedby={dialogDescriptionId}
        fullScreen={fullScreen}
        data-testid={testId}
        {...ariaProps}
        {...dialogProps}
      >
        <DialogTitle
          id={dialogTitleId}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {title}
          {showCloseButton && (
            <Tooltip title={t('actions.close')}>
              <IconButton
                edge="end"
                color="inherit"
                onClick={onClose}
                aria-label={t('actions.close')}
                data-testid={testId ? `${testId}-close` : 'dialog-close'}
                size="small"
              >
                <Close />
              </IconButton>
            </Tooltip>
          )}
        </DialogTitle>

        <DialogContent>
          {description && (
            <span
              id={dialogDescriptionId}
              style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, overflow: 'hidden' }}
            >
              {description}
            </span>
          )}
          {children}
        </DialogContent>

        {actions && <DialogActions>{actions}</DialogActions>}
      </Dialog>
    );
  }
);

AccessibleDialog.displayName = 'AccessibleDialog';

export default AccessibleDialog;
