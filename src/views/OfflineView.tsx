import { useEventLogout } from '@/hooks';
import { useAppStore } from '@/store';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const OFFLINE_IMAGE = '/img/aula_happy.png';

interface OfflineViewProps {
  className?: string;
}

/**
 * View displayed when application is offline
 */
const OfflineView: React.FC<OfflineViewProps> = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const logout = useEventLogout();

  useEffect(() => {
    logout();
    dispatch({ type: 'ADD_POPUP', message: { message: t('errors.offline'), type: 'error' } });
  }, []);

  return <></>;
};

export default OfflineView;
