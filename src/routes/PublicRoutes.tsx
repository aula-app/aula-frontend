import { Route, Routes } from 'react-router-dom';
import AuthRoutes from '../views/Public';
import { NotFoundView } from '../views';
import LoginView from '../views/Public/Login/LoginView';
import AboutView from '../views/About';

/**
 * List of routes available only for anonymous users
 */
const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginView />} />
      <Route path="auth/*" element={<AuthRoutes />} />
      <Route path="about" element={<AboutView />} />,
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default PublicRoutes;
