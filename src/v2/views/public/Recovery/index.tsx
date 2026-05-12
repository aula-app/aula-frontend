import { Route, Routes } from 'react-router-dom';
import { NotFoundView } from '../..';
import RecoveryView from './RecoveryView';

/**
 * Routes for "Recovery" flow
 * url: /auth/recovery/*
 */
const RecoveryRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RecoveryView />} />
      <Route path="password" element={<RecoveryView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default RecoveryRoutes;
