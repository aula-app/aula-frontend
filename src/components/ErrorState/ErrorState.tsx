import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  onClick: () => void;
  message?: string;
  [key: string]: any; // For rest props
}

const ErrorState = ({ onClick, message, ...restOfProps }: ErrorStateProps) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} alignItems="center" justifyContent="center" {...restOfProps}>
      <Typography color="error">{message || t('errors.default')}</Typography>
      <Button variant="outlined" onClick={onClick} size="small">
        {t('actions.retry')}
      </Button>
    </Stack>
  );
};

export default ErrorState;
