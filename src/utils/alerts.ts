import { Dispatch } from 'react';
import { AppAction } from '@/store/AppStore';

export const successAlert = (message: string, dispatch: Dispatch<AppAction>) => {
  dispatch({ type: 'ADD_TOAST', message: { message, type: 'success' } });
};

export const errorAlert = (message: string, dispatch: Dispatch<AppAction>) => {
  dispatch({ type: 'ADD_TOAST', message: { message, type: 'error' } });
};

export const warningAlert = (message: string, dispatch: Dispatch<AppAction>) => {
  dispatch({ type: 'ADD_TOAST', message: { message, type: 'warning' } });
};

export const infoAlert = (message: string, dispatch: Dispatch<AppAction>) => {
  dispatch({ type: 'ADD_TOAST', message: { message, type: 'info' } });
};
