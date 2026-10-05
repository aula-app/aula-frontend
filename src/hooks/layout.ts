import { useMediaQuery, useTheme } from '@mui/material';

/**
 * Hook to detect onMobile vs. onDesktop using Media Query
 * @returns {boolean} true when on onMobile, false when on onDesktop
 */
function useOnMobileByMediaQuery() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
}

export const useOnMobile = useOnMobileByMediaQuery;
