import { localStorageGet, localStorageSet } from '@/utils';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
