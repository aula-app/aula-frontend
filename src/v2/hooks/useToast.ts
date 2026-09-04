import { useAppStore } from '@/store';

export const useToast = () => {
  const [, dispatch] = useAppStore();

  const toast = {
    error: (message: string) => dispatch({ type: 'ADD_TOAST', message: { message, type: 'error' } }),
    success: (message: string) => dispatch({ type: 'ADD_TOAST', message: { message, type: 'success' } }),
    warning: (message: string) => dispatch({ type: 'ADD_TOAST', message: { message, type: 'warning' } }),
    info: (message: string) => dispatch({ type: 'ADD_TOAST', message: { message, type: 'info' } }),
  };

  return { toast };
};
