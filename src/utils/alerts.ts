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

/**
 * Dispatches an info alert to the AppStore
 * @param message The info message to display
 * @param dispatch The dispatch function from useAppStore
 */
export const infoAlert = (message: string, dispatch: Dispatch<any>) => {
  dispatch({
    type: 'ADD_POPUP',
    message: {
      message,
      type: 'success', // Note: AppStore only supports 'success' and 'error' types
    } as PopupType,
  });
};

/**
 * Dispatches a warning alert to the AppStore
 * @param message The warning message to display
 * @param dispatch The dispatch function from useAppStore
 */
export const warningAlert = (message: string, dispatch: Dispatch<any>) => {
  dispatch({
    type: 'ADD_POPUP',
    message: {
      message,
      type: 'error', // Note: AppStore only supports 'success' and 'error' types
    } as PopupType,
  });
};
