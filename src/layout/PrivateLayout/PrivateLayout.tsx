import OfflineView from '@/views/OfflineView';
import { FunctionComponent } from 'react';
import { APP_TITLE } from '../config';
import LayoutContainer from './LayoutContainer';
import { useIsOnlineState } from '@/hooks/instance';

/**
 * Renders "Private Layout" composition
 * @component PrivateLayout
 */

const PrivateLayout: FunctionComponent<{ children?: React.ReactNode }> = ({ children }) => {
  const { online } = useIsOnlineState();

  document.title = APP_TITLE;

  return !online ? <OfflineView /> : <LayoutContainer>{children}</LayoutContainer>;
};

export default PrivateLayout;
