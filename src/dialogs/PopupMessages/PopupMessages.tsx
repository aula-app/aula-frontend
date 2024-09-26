import { useAppStore } from '@/store';
import { PopupType } from '@/store/AppStore';
import { Alert } from '@mui/material';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { ForwardedRef, forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SnackbarProps {
  message: string;
}

/**
 * Renders "ErrorMessages" component
 * url: /
 */

const ErrorMessages = () => {
  const { t } = useTranslation();
  const [state, dispatch] = useAppStore();
  let currentStack = [] as PopupType[];

  const handleClose = (index: number) => {
    currentStack.filter((e, i) => i !== index);
    dispatch({ type: 'REMOVE_POPUP', index });
  };

  useEffect(() => {
    const newMessages = [...new Set(state.messages.filter((x) => !currentStack.includes(x)))];
    newMessages.map((message, i) =>
      enqueueSnackbar(message.message, { variant: message.type, onClose: () => handleClose(i) })
    );
    currentStack = [...currentStack, ...newMessages];
  }, [JSON.stringify(state.messages)]);

  const AlertSnackbar = forwardRef((props: SnackbarProps, ref: ForwardedRef<HTMLDivElement>) => (
    <Alert ref={ref} severity="error" variant="filled" sx={{ width: '100%' }} role="alert">
      {props.message}
    </Alert>
  ));

  const addError = (e: CustomEvent<any>) => {
    dispatch({ type: 'ADD_POPUP', message: { message: t(e.detail), type: 'error' } });
  };

  useEffect(() => {
    document.addEventListener('AppErrorDialog', ((e: CustomEvent) => addError(e)) as EventListener);
  }, []);

  return (
    <SnackbarProvider
      autoHideDuration={3000}
      Components={{
        error: AlertSnackbar,
      }}
    />
  );
};

export default ErrorMessages;
