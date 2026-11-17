import type { ToastMessage } from '@/store/AppStore';
import { UNSTABLE_ToastQueue as ToastQueue } from 'react-aria-components';

export interface ToastContent extends ToastMessage {
  createdAt: number;
}

export const toastQueue = new ToastQueue<ToastContent>({ maxVisibleToasts: 3 });

export const addToast = (toast: ToastMessage) => {
  const isShowing = toastQueue.visibleToasts.some(
    ({ content }) => content.message === toast.message && content.type === toast.type
  );
  if (!isShowing) toastQueue.add({ ...toast, createdAt: Date.now() });
};

export const clearPageToasts = (before: number) => {
  toastQueue.visibleToasts
    .filter(({ content }) => ['success', 'info'].includes(content.type) && !content.persistent)
    .filter(({ content }) => content.createdAt <= before)
    .forEach(({ key }) => toastQueue.close(key));
};
