import { useAppStore } from '@/store';
import { ToastMessage } from '@/store/AppStore';
import { useTranslation } from 'react-i18next';
import Icon, { ICON_TYPE } from '../Icon';

const TOAST_STYLES: Record<ToastMessage['type'], string> = {
  error: 'bg-red-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-blue-600 text-white',
};

const TOAST_ICONS: Record<ToastMessage['type'], ICON_TYPE> = {
  error: 'error',
  success: 'check',
  warning: 'alert',
  info: 'info',
};

const TOAST_ROLES: Record<ToastMessage['type'], 'alert' | 'status'> = {
  error: 'alert',
  warning: 'alert',
  success: 'status',
  info: 'status',
};

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const ToastItem = ({ toast, onDismiss }: ToastItemProps) => {
  const { t } = useTranslation();

  return (
    <div
      role={TOAST_ROLES[toast.type]}
      aria-live={toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg min-w-72 max-w-sm ${TOAST_STYLES[toast.type]}`}
    >
      <Icon type={TOAST_ICONS[toast.type]} aria-hidden="true" />
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        type="button"
        aria-label={t('ui.common.dismiss')}
        onClick={() => onDismiss(toast.id)}
        className="ml-1 rounded p-1 opacity-80 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <Icon type="close" aria-hidden="true" />
      </button>
    </div>
  );
};

const Toast = () => {
  const [state, dispatch] = useAppStore();

  const handleDismiss = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', id });
  };

  return (
    <div
      aria-label="Notifications"
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
    >
      {state.toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={handleDismiss} />
        </div>
      ))}
    </div>
  );
};

export default Toast;
