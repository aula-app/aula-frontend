import { localStorageGet, localStorageSet } from '@/utils';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsOnline } from './auth';

export const useCodeManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState<string>(localStorageGet('code'));

  const resetCode = async () => {
    localStorageSet('code', '').then(() => {
      navigate('/code');
    });
  };

  useEffect(() => {
    setCode(localStorageGet('code'));
  }, [location.pathname]);

  return {
    code,
    resetCode,
  };
};

export const useIsOnlineState = () => {
  const location = useLocation();
  const [online, setOnline] = useState(true);

  const checkOnlineStatus = async () => {
    setOnline(await useIsOnline());
  };

  useEffect(() => {
    checkOnlineStatus();
  }, [location]);

  return {
    online,
  };
};
