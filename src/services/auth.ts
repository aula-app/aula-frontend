import { Dispatch } from 'react';
import { localStorageDelete } from '@/utils';

export const clearAuth = (dispatch: Dispatch<{ type: string }>) => {
  localStorageDelete('token');
  dispatch({ type: 'LOG_OUT' });
};
