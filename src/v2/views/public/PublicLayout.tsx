
import { FunctionComponent, PropsWithChildren } from 'react';
import PublicRoutes from './PublicRoutes';


const PublicLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <PublicRoutes />
  );
};

export default PublicLayout;
