import { useState, useCallback } from 'react';
import { useAppStore } from '@/store';
import { ToastMessage } from '@/store/AppStore';
import { useTranslation } from 'react-i18next';
import Icon, { ICON_TYPE } from '../Icon';
import IconButton from '../../button/IconButton';

const TOAST_STYLES: Record<ToastMessage['type'], string> = {
  error: 'bg-error text-error-text',
  success: 'bg-success text-success-text',
  warning: 'bg-warning text-warning-text',
  info: 'bg-info text-info-text',
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

const EXIT_DURATION_MS = 200;

interface ToastItemProps {
  toast: ToastMessage;
  isExiting: boolean;
  onDismiss: (id: string) => void;
}

const ToastItem = ({ toast, isExiting, onDismiss }: ToastItemProps) => {
  const { t } = useTranslation();

  return (
    <div
      role={TOAST_ROLES[toast.type]}
      aria-live={toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={`flex items-center gap-3 rounded-2xl rounded-tr-none pl-6 pr-4 py-2 shadow-lg min-w-72 max-w-sm ${TOAST_STYLES[toast.type]} ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}`}
    >
      <Icon type={TOAST_ICONS[toast.type]} aria-hidden="true" />
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <IconButton type="button" aria-label={t('ui.common.dismiss')} onClick={() => onDismiss(toast.id)}>
        <Icon type="close" aria-hidden="true" />
      </IconButton>
    </div>
  );
};

const Toast = () => {
  const [state, dispatch] = useAppStore();
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

  const handleDismiss = useCallback((id: string) => {
    setExitingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', id });
      setExitingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, EXIT_DURATION_MS);
  }, [dispatch]);

  return (
    <div aria-label="Notifications" className="fixed top-4 right-4 z-50 flex flex-col pointer-events-none">
      {state.toasts.map((toast) => {
        const isExiting = exitingIds.has(toast.id);
        return (
          <div key={toast.id} className={`pointer-events-auto ${isExiting ? 'animate-toast-collapse' : 'pb-2'}`}>
            <ToastItem toast={toast} isExiting={isExiting} onDismiss={handleDismiss} />
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
