import NotFoundView from '@/v2/views/private/NotFound';
import ConfigView from '@/views/Settings/Config';
import { Route, Routes } from 'react-router-dom';

/**
 * Routes rendered when the system is in "hidden" mode.
 * Only configuration is accessible; all other paths fall through to NotFound.
 */
const RestrictedRoutes = () => (
  <Routes>
    <Route path="/" element={<ConfigView />} />
    <Route path="*" element={<NotFoundView />} />
  </Routes>
);

export default RestrictedRoutes;
