import { Route, Routes } from 'react-router-dom';
import { NotFoundView } from '../..';
import LoginView from './LoginView';

/**
 * Routes for "Login" flow
 * url: /auth/login/*
 */
const LoginRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default LoginRoutes;
