import { announceLoadingState } from '@/utils';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LoadingIndicatorProps {
  /**
   * Whether content is currently loading
   */
  isLoading: boolean;
  
  /**
   * Optional name of the resource being loaded, will be used in screen reader announcements
   */
  resourceName?: string;
  
  /**
   * Optional text to display while loading. If not provided, uses 'actions.loading'
   */
  loadingText?: string;
  
  /**
   * Optional size for the CircularProgress component
   * @default 40
   */
  size?: number;
}

/**
 * A loading indicator component that properly announces loading states to screen readers
 * via aria-live regions.
 */
const LoadingIndicator = ({ 
  isLoading, 
  resourceName, 
  loadingText,
  size = 40
}: LoadingIndicatorProps) => {
  const { t } = useTranslation();
  
  // Announce loading state changes to screen readers
  useEffect(() => {
    announceLoadingState(isLoading, resourceName);
  }, [isLoading, resourceName]);
  
  if (!isLoading) return null;
  
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      py={3}
      role="status"
      aria-live="polite"
    >
      <CircularProgress size={size} />
      <Typography variant="body1" mt={2}>
        {loadingText || t('actions.loading')}
        {resourceName ? ` ${resourceName}...` : '...'}
      </Typography>
    </Box>
  );
};

export default LoadingIndicator;