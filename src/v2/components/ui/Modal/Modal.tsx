import Icon from '@/v2/components/ui/Icon';
import IconButton from '@/v2/components/button/IconButton';
import { ReactNode, useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      data-testid="modal"
      aria-label={title}
      onClick={handleBackdropClick}
      className="fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-full bg-transparent p-0 max-h-none overflow-visible"
    >
      <div
        className={`w-full max-h-[90vh] rounded-t-2xl bg-paper text-text-primary shadow-2xl border-t border-secondary
          pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] transform-gpu
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="relative overflow-y-auto max-h-[90vh]">
          <div className="absolute top-2 right-2">
            <IconButton aria-label={t('ui.common.dismiss')} onClick={onClose}>
              <Icon type="close" aria-hidden="true" />
            </IconButton>
          </div>
          {children}
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
