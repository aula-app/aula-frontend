import { addToast } from '@/v2/components/ui/Toast/toastQueue';

const toast = {
  error: (message: string) => addToast({ message, type: 'error' }),
  success: (message: string) => addToast({ message, type: 'success' }),
  warning: (message: string) => addToast({ message, type: 'warning' }),
  info: (message: string) => addToast({ message, type: 'info' }),
};

export const useToast = () => ({ toast });
