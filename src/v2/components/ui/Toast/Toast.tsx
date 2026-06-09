import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '@/store';
import { ToastMessage } from '@/store/AppStore';
import { useTranslation } from 'react-i18next';
import Icon, { ICON_TYPE } from '../Icon';
import IconButton from '../../button/IconButton';

const TOAST_STYLES: Record<ToastMessage['type'], string> = {
  error: 'bg-error text-error-fg',
  success: 'bg-success text-success-fg',
  warning: 'bg-warning text-warning-fg',
  info: 'bg-info text-info-fg',
};

const TOAST_ICONS: Record<ToastMessage['type'], ICON_TYPE> = {
  error: 'error',
  success: 'check',
  warning: 'alert',
  info: 'info',
};

const EXIT_DURATION_MS = 200;

interface ToastItemProps {
  toast: ToastMessage;
  isExiting: boolean;
  onDismiss: (id: string) => void;
}

const ToastItem = ({ toast, isExiting, onDismiss }: ToastItemProps) => {
  const { t } = useTranslation();
  const dismissButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = dismissButtonRef.current?.closest('[data-toast]') as HTMLElement | null;
    if (!el) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onDismiss(toast.id);
      }
    };
    el.addEventListener('keydown', handleKeyDown);
    return () => el.removeEventListener('keydown', handleKeyDown);
  }, [toast.id, onDismiss]);

  return (
    <div
      data-toast
      data-testid={`toast-${toast.type}`}
      // role + aria-live kept for visual context; announcements go through the hidden live regions
      role={toast.type === 'error' || toast.type === 'warning' ? 'alert' : 'status'}
      aria-atomic="true"
      className={`flex items-center gap-3 rounded-2xl rounded-tr-none pl-6 pr-4 py-2 shadow-lg min-w-72 max-w-sm ${TOAST_STYLES[toast.type]} ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}`}
    >
      <Icon type={TOAST_ICONS[toast.type]} aria-hidden="true" />
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <IconButton
        ref={dismissButtonRef}
        type="button"
        aria-label={t('ui.common.dismiss')}
        onClick={() => onDismiss(toast.id)}
      >
        <Icon type="close" aria-hidden="true" />
      </IconButton>
    </div>
  );
};

/**
 * Persistent, visually-hidden live regions.
 * Must exist in the DOM before any announcements — screen readers (especially JAWS)
 * ignore content injected into a live region that was itself just inserted.
 */
const ToastAnnouncer = ({ assertive, polite }: { assertive: string; polite: string }) => (
  <>
    <div role="alert" aria-live="assertive" aria-atomic="true" className="sr-only">
      {assertive}
    </div>
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {polite}
    </div>
  </>
);

const Toast = () => {
  const [state, dispatch] = useAppStore();
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const [assertiveMsg, setAssertiveMsg] = useState('');
  const [politeMsg, setPoliteMsg] = useState('');
  const prevToastIds = useRef<Set<string>>(new Set());

  // Announce only newly added toasts
  useEffect(() => {
    const currentIds = new Set(state.toasts.map((t) => t.id));
    for (const toast of state.toasts) {
      if (!prevToastIds.current.has(toast.id)) {
        if (toast.type === 'error' || toast.type === 'warning') {
          setAssertiveMsg('');
          setTimeout(() => setAssertiveMsg(toast.message), 50);
        } else {
          setPoliteMsg('');
          setTimeout(() => setPoliteMsg(toast.message), 50);
        }
      }
    }
    prevToastIds.current = currentIds;
  }, [state.toasts]);

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
    <>
      <ToastAnnouncer assertive={assertiveMsg} polite={politeMsg} />
      <div
        role="region"
        aria-label="Notifications"
        className="fixed top-4 right-4 z-50 flex flex-col pointer-events-none"
      >
        {state.toasts.map((toast) => {
          const isExiting = exitingIds.has(toast.id);
          return (
            <div key={toast.id} className={`pointer-events-auto ${isExiting ? 'animate-toast-collapse' : 'pb-2'}`}>
              <ToastItem toast={toast} isExiting={isExiting} onDismiss={handleDismiss} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Toast;
