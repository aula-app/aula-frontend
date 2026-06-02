import { ReactNode, useEffect, useId, useRef, useState } from 'react';

const TRANSITION_MS = 300;

interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title: string;
  children: ReactNode;
  role?: 'dialog' | 'alertdialog';
  describedBy?: string;
}

const Dialog = ({ open, onClose, title, children, role = 'dialog', describedBy }: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isVisible, setVisible] = useState(false);
  const titleId = useId();

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
      onClose?.();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  const handleBackdropClick = onClose
    ? (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === e.currentTarget) onClose();
      }
    : undefined;

  return (
    <dialog
      ref={dialogRef}
      role={role}
      aria-labelledby={titleId}
      aria-describedby={describedBy}
      aria-modal="true"
      onClick={handleBackdropClick}
      className="fixed inset-0 m-auto bg-transparent p-0 w-full max-w-sm backdrop:bg-background"
    >
      <h2 id={titleId} className="sr-only">
        {title}
      </h2>
      <div
        className={`bg-paper text-text-primary rounded-2xl shadow-2xl border border-secondary/20
          transition-all duration-300 ease-out transform-gpu
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {children}
      </div>
    </dialog>
  );
};

export default Dialog;
