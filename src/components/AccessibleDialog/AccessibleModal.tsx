import { announceToScreenReader, useEscapeKey, useFocusTrap, useModalAnnouncement } from '@/utils';
import { Close } from '@mui/icons-material';
import { Backdrop, Box, Fade, IconButton, Modal, ModalProps, Tooltip, Typography } from '@mui/material';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export interface AccessibleModalProps extends Omit<ModalProps, 'children'> {
  /**
   * The title of the modal
   */
  title: string;

  /**
   * Description of the modal for screen readers
   */
  description?: string;

  /**
   * Whether to show a close button in the modal title
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * The content of the modal
   */
  children: React.ReactNode;

  /**
   * Actions to display at the bottom of the modal
   */
  actions?: React.ReactNode;

  /**
   * Function to close the modal
   */
  onClose: () => void;

  /**
   * Whether the modal is open
   */
  open: boolean;

  /**
   * Element that should receive focus when the modal is opened
   */
  initialFocusRef?: React.RefObject<HTMLElement>;

  /**
   * Element that should receive focus when the modal is closed
   */
  finalFocusRef?: React.RefObject<HTMLElement>;

  /**
   * Maximum width of the modal
   * @default '600px'
   */
  maxWidth?: string | number;

  /**
   * Optional test ID for testing
   */
  testId?: string;
}

export interface AccessibleModalHandle {
  /**
   * Focus the modal or a specific element within it
   */
  focus: () => void;

  /**
   * Get the modal element
   */
  getModalElement: () => HTMLElement | null;
}

/**
 * An accessible modal component based on Material-UI Modal
 * that implements WAI-ARIA dialog practices:
 * - Focus management
 * - Keyboard interaction
 * - Screen reader announcements
 */
const AccessibleModal = forwardRef<AccessibleModalHandle, AccessibleModalProps>(
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
      maxWidth = '600px',
      testId,
      ...modalProps
    },
    ref
  ) => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLDivElement>(null);

    // Implement handle for external control
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus();
        } else if (modalRef.current) {
          // Find the first focusable element
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          (focusableElements[0] as HTMLElement)?.focus();
        }
      },
      getModalElement: () => modalRef.current,
    }));

    // Set up focus trap
    useFocusTrap(open, modalRef, initialFocusRef, finalFocusRef);

    // Handle escape key
    useEscapeKey(open, onClose);

    // Announce modal to screen readers
    useModalAnnouncement(open, title, t);

    // Announce modal closure
    useEffect(() => {
      if (!open) {
        announceToScreenReader(t('ui.accessibility.modalClosed'), 'polite');
      }
    }, [open, t]);

    // Define modal ID for aria-labelledby and aria-describedby
    const modalTitleId = `${title.toLowerCase().replace(/\s+/g, '-')}-modal-title`;
    const modalDescriptionId = description
      ? `${title.toLowerCase().replace(/\s+/g, '-')}-modal-description`
      : undefined;

    return (
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        aria-labelledby={modalTitleId}
        aria-describedby={modalDescriptionId}
        {...modalProps}
      >
        <Fade in={open}>
          <Box
            ref={modalRef}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth,
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 24,
              p: 0,
              outline: 'none', // Remove focus outline
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            tabIndex={-1} // Make the container focusable but not in tab order
            role="dialog"
            aria-modal="true"
            data-testid={testId}
          >
            {/* Header */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" component="h2" id={modalTitleId}>
                {title}
              </Typography>

              {showCloseButton && (
                <Tooltip title={t('actions.close')}>
                  <IconButton edge="end" color="inherit" onClick={onClose} aria-label={t('actions.close')} size="small">
                    <Close />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* Content */}
            <Box
              sx={{
                px: 3,
                py: 2,
                overflowY: 'auto', // Allow content to scroll
                flexGrow: 1,
              }}
            >
              {description && (
                <span
                  id={modalDescriptionId}
                  style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, overflow: 'hidden' }}
                >
                  {description}
                </span>
              )}
              <Box
                sx={{
                  '& > *:first-of-type': {
                    mt: 0, // Remove top margin from first element
                  },
                  '& > *:last-child': {
                    mb: 0, // Remove bottom margin from last element
                  },
                }}
              >
                {children}
              </Box>
            </Box>

            {/* Actions */}
            {actions && (
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 1,
                }}
              >
                {actions}
              </Box>
            )}

            {/* Screen reader help text */}
            <span
              style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, overflow: 'hidden' }}
              aria-live="polite"
            >
              {t('ui.accessibility.pressToClose')}
            </span>
          </Box>
        </Fade>
      </Modal>
    );
  }
);

AccessibleModal.displayName = 'AccessibleModal';

export default AccessibleModal;
