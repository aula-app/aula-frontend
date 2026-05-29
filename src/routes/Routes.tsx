import Toast from '@/v2/components/ui/Toast';
import { useConsentSync, useIsAuthenticated } from '@/hooks/auth';
import Private from '@/v2/views/private';
import Public from '@/v2/views/public';
import { useLocation } from 'react-router';

/**
 * Renders routes depending on Authenticated or Anonymous users
 */
const Routes = () => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated(); // Variant 2

  useConsentSync(isAuthenticated, location.pathname);

  const autentication = () => (isAuthenticated ? <Private /> : <Public />);

  return (
    <>
      {autentication()}
      <Toast />
    </>
  );
};
export default Routes;
