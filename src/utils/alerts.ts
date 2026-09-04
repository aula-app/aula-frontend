import { Dispatch } from 'react';
import { ToastMessage } from '@/store/AppStore';

export const successAlert = (message: string, dispatch: Dispatch<any>) => {
  dispatch({ type: 'ADD_TOAST', message: { message, type: 'success' } as Omit<ToastMessage, 'id'> });
};

export const errorAlert = (message: string, dispatch: Dispatch<any>) => {
  dispatch({ type: 'ADD_TOAST', message: { message, type: 'error' } as Omit<ToastMessage, 'id'> });
};

export const warningAlert = (message: string, dispatch: Dispatch<any>) => {
  dispatch({ type: 'ADD_TOAST', message: { message, type: 'warning' } as Omit<ToastMessage, 'id'> });
};

export const infoAlert = (message: string, dispatch: Dispatch<any>) => {
  dispatch({ type: 'ADD_TOAST', message: { message, type: 'info' } as Omit<ToastMessage, 'id'> });
};
