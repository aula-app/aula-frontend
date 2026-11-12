import Icon from '@/v2/components/ui/Icon';
import IconButton from '@/v2/components/button/IconButton';
import { useBackdropDismiss } from '@/v2/hooks/useBackdropDismiss';
import { useEscapeDismiss } from '@/v2/hooks/useEscapeDismiss';
import { ReactNode, useEffect, useId, useRef, useState } from 'react';
import { UNSAFE_PortalProvider } from 'react-aria';
import { useTranslation } from 'react-i18next';

const TRANSITION_MS = 300;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal = ({ open, onClose, title, children }: ModalProps) => {
  const { t } = useTranslation();
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.removeAttribute('data-closing');
      dialog.showModal();
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      dialog.setAttribute('data-closing', '');
      const timer = setTimeout(() => {
        dialog.removeAttribute('data-closing');
        dialog.close();
      }, TRANSITION_MS);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEscapeDismiss(dialogRef, onClose);
  const backdropDismiss = useBackdropDismiss(onClose);

  return (
    <dialog
      ref={dialogRef}
      data-testid="modal"
      aria-labelledby={titleId}
      {...backdropDismiss}
      className="fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-full bg-transparent p-0 max-h-none overflow-visible"
    >
      <div
        className={`w-full max-h-[90vh] rounded-t-3xl bg-background text-foreground shadow-2xl border-t border-secondary
          pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isVisible ? '' : 'translate-y-full'}`}
      >
        <div className="relative overflow-y-auto max-h-[90vh] p-4">
          <div className="absolute top-2 right-2">
            <IconButton aria-label={t('ui.common.dismiss')} onClick={onClose}>
              <Icon type="close" aria-hidden="true" />
            </IconButton>
          </div>
          <h2 id={titleId} className="mb-4 pr-8 text-lg font-semibold text-foreground">
            {title}
          </h2>
          <UNSAFE_PortalProvider getContainer={() => dialogRef.current}>{children}</UNSAFE_PortalProvider>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
