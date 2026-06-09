import { useAppStore } from '@/store';
import { localStorageDelete } from '@/utils';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useLogout() {
  const [, dispatch] = useAppStore();
  const navigate = useNavigate();

  return useCallback(() => {
    localStorageDelete('token');
    dispatch({ type: 'LOG_OUT' });
    navigate('/');
  }, [dispatch, navigate]);
}
