import { useAppStore } from '@/store';
import { Close } from '@mui/icons-material';
import { Alert, IconButton } from '@mui/material';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { ForwardedRef, forwardRef, useCallback, useEffect, useState } from 'react';

interface SnackbarProps {
  message: string;
}

/**
 * Renders "ErrorMessages" component
 * url: /
 */
const ErrorMessages = () => {
  const [state, dispatch] = useAppStore();
  let currentStack = [] as string[];

  const handleClose = (index: number) => {
    currentStack.filter((e, i) => i !== index);
    dispatch({ type: 'REMOVE_ERROR', index });
  };

  useEffect(() => {
    const newMessages = [...new Set(state.errors.filter(x => !currentStack.includes(x)))];
    newMessages.map((error, i) => enqueueSnackbar(error, { variant: 'error', onClose: () => handleClose(i) }));
    currentStack = [...currentStack, ...newMessages]
    console.log(currentStack, newMessages)
  }, [JSON.stringify(state.errors)]);

  const AlertSnackbar = forwardRef((props: SnackbarProps, ref: ForwardedRef<HTMLDivElement>) => (
    <Alert ref={ref} severity="error" variant="filled" sx={{ width: '100%' }} role="alert">
      {props.message}
    </Alert>
  ));

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
