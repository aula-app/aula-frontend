import { useAppStore } from '@/store';
import { Alert, Box, Snackbar } from '@mui/material';
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
      dispatch({ type: 'REMOVE_ERROR', index: 0 });
    }, 300);
  };

  useEffect(() => {
    if(state.errors.length > 0) setOpen(true);
  }, [JSON.stringify(state.errors)])

  return (
    <>
    <Box
      top={0}
      position="absolute"
      zIndex={10000}>
      {state.errors.map(error => <>{error}<br /></>)}
    </Box>
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={5000}
      open={open}

      >
      <Alert
         onClose={handleClose}
         variant='filled'
         severity='error'>
        {state.errors[0]}
      </Alert>
    </Snackbar>
    </>
  );
};

export default ErrorMessages;
