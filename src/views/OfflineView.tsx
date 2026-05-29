import { useAppStore } from '@/store';
import { localStorageDelete } from '@/utils';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface OfflineViewProps {
  className?: string;
}

/**
 * View displayed when application is offline.
 * Clears the session and redirects to the public /offline page.
 */
const OfflineView: React.FC<OfflineViewProps> = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    localStorageDelete('token');
    dispatch({ type: 'LOG_OUT' });
    dispatch({ type: 'ADD_TOAST', message: { message: t('errors.offline'), type: 'error' } });
    navigate('/offline');
  }, []);

  return <></>;
};

export default OfflineView;
