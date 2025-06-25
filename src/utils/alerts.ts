import { Dispatch } from 'react';
import { PopupType } from '@/store/AppStore';

/**
 * Dispatches a success alert to the AppStore
 * @param message The message to display in the alert
 * @param dispatch The dispatch function from useAppStore
 */
export const successAlert = (message: string, dispatch: Dispatch<any>) => {
  dispatch({
    type: 'ADD_POPUP',
    message: {
      message,
      type: 'success',
    } as PopupType,
  });
};

/**
 * Dispatches an error alert to the AppStore
 * @param message The error message to display
 * @param dispatch The dispatch function from useAppStore
 */
export const errorAlert = (message: string, dispatch: Dispatch<any>) => {
  dispatch({
    type: 'ADD_POPUP',
    message: {
      message,
      type: 'error',
    } as PopupType,
  });
};

