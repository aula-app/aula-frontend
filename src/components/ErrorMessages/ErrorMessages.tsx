import { useAppStore } from '@/store';
import { Alert, Box, Snackbar, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

/**
 * Renders "ErrorMessages" component
 * url: /
 */
const ErrorMessages = () => {
  const [state, dispatch] = useAppStore();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    const interval = setTimeout(() => {
      dispatch({ type: 'REMOVE_ALL_ERRORS' });
    }, 300);
  };

  useEffect(() => {
    if (state.errors.length > 0) setOpen(true);
  }, [JSON.stringify(state.errors)]);

  return (
    <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} autoHideDuration={2000} open={open}>
      <div>
        {state.errors.map((message, i) => (
          <Alert onClose={handleClose} variant="filled" severity="error" key={i} sx={{mt: 1}}>
            <Box>{message}</Box>
          </Alert>
        ))}
      </div>
    </Snackbar>
  );
};

export default ErrorMessages;
