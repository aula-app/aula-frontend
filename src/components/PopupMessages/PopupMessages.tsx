import { useAppStore } from '@/store';
import { PopupType } from '@/store/AppStore';
import { Alert, Box } from '@mui/material';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { ForwardedRef, forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SnackbarProps {
  message: string;
}

/**
 * Renders "PopupMessages" component which handles:
 * - Error/success notifications with Snackbar
 * - Live region announcements for screen readers
 * url: /
 */

const PopupMessages = () => {
  const { t } = useTranslation();
  const [state, dispatch] = useAppStore();
  let currentStack = [] as PopupType[];

  const handleClose = (index: number) => {
    currentStack.filter((e, i) => i !== index);
    dispatch({ type: 'REMOVE_POPUP', index });
  };

  useEffect(() => {
    const newMessages = [...new Set(state.messages.filter((x) => !currentStack.includes(x)))];
    newMessages.map((message, i) => {
      // Also announce messages to screen readers via the live region
      const liveRegion = document.getElementById('a11y-live-announcer');
      if (liveRegion) {
        liveRegion.textContent = message.message;
      }
      
      return enqueueSnackbar(message.message, { 
        variant: message.type, 
        onClose: () => handleClose(i) 
      });
    });
    currentStack = [...currentStack, ...newMessages];
  }, [JSON.stringify(state.messages)]);

  // Create components for different alert types
  const ErrorSnackbar = forwardRef((props: SnackbarProps, ref: ForwardedRef<HTMLDivElement>) => (
    <Alert ref={ref} severity="error" variant="filled" sx={{ width: '100%' }} role="alert">
      {props.message}
    </Alert>
  ));

  const SuccessSnackbar = forwardRef((props: SnackbarProps, ref: ForwardedRef<HTMLDivElement>) => (
    <Alert ref={ref} severity="success" variant="filled" sx={{ width: '100%' }} role="alert">
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
        }}
      />
    </>
  );
};

export default PopupMessages;
