import { ToastMessage } from '@/store/AppStore';
import { useCallback, useEffect, useRef } from 'react';
import {
  Button,
  I18nProvider,
  Text,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as ToastContent,
  UNSTABLE_ToastRegion as ToastRegion,
} from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Icon, { ICON_TYPE } from '../Icon';
import { clearPageToasts, toastQueue } from './toastQueue';

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

const FOCUS_RING = 'outline-none outline-foreground data-focus-visible:outline-solid data-focus-visible:outline-2';

const NAVIGATION_GRACE_MS = 1000;

const Toast = () => {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);
  const resizeObserver = useRef<ResizeObserver>();

  const trackInset = useCallback((region: HTMLDivElement | null) => {
    resizeObserver.current?.disconnect();
    const root = document.documentElement.style;
    if (!region) return root.removeProperty('--toast-inset');
    resizeObserver.current = new ResizeObserver(() =>
      root.setProperty('--toast-inset', `${region.getBoundingClientRect().bottom}px`)
    );
    resizeObserver.current.observe(region);
  }, []);

  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;
    clearPageToasts(Date.now() - NAVIGATION_GRACE_MS);
  }, [pathname]);

  return (
    <I18nProvider locale={i18n.language}>
      <ToastRegion
        ref={trackInset}
        queue={toastQueue}
        className={`fixed z-50 flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm outline-none group
          top-[calc(4rem+var(--safe-area-inset-top,0px))] right-[calc(1rem+env(safe-area-inset-right))]`}
      >
        {({ toast }) => (
          <AriaToast
            toast={toast}
            data-testid={`toast-${toast.content.type}`}
            className={`flex items-center gap-3 rounded-2xl rounded-tr-none pl-6 pr-2 py-2 shadow-lg
              animate-toast-in motion-reduce:animate-none -outline-offset-4  ${FOCUS_RING}
              group-data-focus-visible:outline-solid group-data-focus-visible:outline-2
              ${TOAST_STYLES[toast.content.type]}`}
          >
            <Icon type={TOAST_ICONS[toast.content.type]} aria-hidden="true" />
            <ToastContent className="flex-1">
              <Text slot="title" className="text-sm font-medium">
                {toast.content.message}
              </Text>
            </ToastContent>
            <Button
              slot="close"
              className={`flex shrink-0 items-center justify-center rounded-full p-2 cursor-pointer
                data-hovered:bg-black/10 data-pressed:bg-black/20 ${FOCUS_RING}`}
            >
              <Icon type="close" aria-hidden="true" />
            </Button>
          </AriaToast>
        )}
      </ToastRegion>
    </I18nProvider>
  );
};

export default Toast;
