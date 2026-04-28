import { useAppStore } from '@/store';
import { PopupType } from '@/store/AppStore';
import { Alert, Box } from '@mui/material';
import { SnackbarProvider, closeSnackbar, enqueueSnackbar, SnackbarKey } from 'notistack';
import { ForwardedRef, forwardRef, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../new/Icon';
import IconButton from '../new/IconButton';

interface SnackbarProps {
  message: string;
  action?: ReactNode;
  id: SnackbarKey;
  variant: PopupType['type'];
}

/**
 * Renders "PopupMessages" component which handles:
 * - Error/success notifications with Snackbar
 * - Live region announcements for screen readers
 * url: /
 */

const alertBaseStyles = {
  width: '100%',
  alignItems: 'center',
  '& .MuiAlert-icon': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .MuiAlert-action': {
    display: 'flex',
    alignItems: 'center',
    margin: 0,
  },
};

const PopupMessages = () => {
  const { t } = useTranslation();
  const [state, dispatch] = useAppStore();
  let currentStack = [] as PopupType[];

  const handleClose = (index: number) => {
    if (index < 0) return;
    currentStack = currentStack.filter((_, i) => i !== index);
    dispatch({ type: 'REMOVE_POPUP', index });
  };

  const renderPersistentDismissAction = (snackbarId: SnackbarKey) => (
    <IconButton
      type="button"
      aria-label={t('ui.common.dismiss')}
      onClick={() => closeSnackbar(snackbarId)}
      className="ml-2"
    >
      <Icon type="close" />
    </IconButton>
  );

  useEffect(() => {
    const newMessages = [...new Set(state.messages.filter((x) => !currentStack.includes(x)))];
    newMessages.map((message) => {
      const messageIndex = state.messages.indexOf(message);
      // Also announce messages to screen readers via the live region
      const liveRegion = document.getElementById('a11y-live-announcer');
      if (liveRegion) {
        liveRegion.textContent = message.message;
      }

      const isPersistentAlert = message.type === 'info';

      return enqueueSnackbar(message.message, {
        variant: message.type,
        onClose: () => handleClose(messageIndex),
        persist: isPersistentAlert,
      });
    });
    currentStack = [...currentStack, ...newMessages];
  }, [JSON.stringify(state.messages)]);

  // Create components for different alert types
  const ErrorSnackbar = forwardRef((props: SnackbarProps, ref: ForwardedRef<HTMLDivElement>) => (
    <Alert
      ref={ref}
      severity="error"
      variant="filled"
      sx={alertBaseStyles}
      role="alert"
      data-testid="error-alert"
      action={props.action}
    >
      {props.message}
    </Alert>
  ));

  const SuccessSnackbar = forwardRef((props: SnackbarProps, ref: ForwardedRef<HTMLDivElement>) => (
    <Alert
      ref={ref}
      severity="success"
      variant="filled"
      sx={alertBaseStyles}
      role="alert"
      data-testid="success-alert"
      action={props.action}
    >
      {props.message}
    </Alert>
  ));

  const AlertSnackbar = forwardRef((props: SnackbarProps, ref: ForwardedRef<HTMLDivElement>) => (
    <Alert
      ref={ref}
      severity="warning"
      variant="filled"
      sx={alertBaseStyles}
      role="alert"
      data-testid="warning-alert"
      action={props.variant === 'info' ? renderPersistentDismissAction(props.id) : props.action}
    >
      {props.message}
    </Alert>
  ));

  const addError = (e: CustomEvent<any>) => {
    dispatch({ type: 'ADD_POPUP', message: { message: t(e.detail), type: 'error' } });
  };

  useEffect(() => {
    document.addEventListener('AppErrorDialog', ((e: CustomEvent) => addError(e)) as EventListener);
    return () => {
      document.removeEventListener('AppErrorDialog', ((e: CustomEvent) => addError(e)) as EventListener);
    };
  }, []);

  return (
    <>
      {/* Live regions for screen reader announcements */}
      <Box
        id="a11y-live-announcer"
        aria-live="polite"
        aria-atomic="true"
        sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
      />

      {/* Status announcer for loading states */}
      <Box
        id="a11y-status-announcer"
        aria-live="assertive"
        aria-atomic="true"
        sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
      />

      <SnackbarProvider
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        Components={{
          error: ErrorSnackbar,
          success: SuccessSnackbar,
          info: AlertSnackbar,
        }}
      />
    </>
  );
};

export default PopupMessages;
