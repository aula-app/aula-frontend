import { FC, ReactNode, useEffect, useId, useRef, useState } from 'react';
import { UNSAFE_PortalProvider } from 'react-aria';
import { createPortal } from 'react-dom';
import { useBackdropDismiss } from '@/v2/hooks/useBackdropDismiss';
import { useEscapeDismiss } from '@/v2/hooks/useEscapeDismiss';

const TRANSITION_MS = 300;

interface DialogProps extends React.ComponentProps<'dialog'> {
  open: boolean;
  onClose?: () => void;
  onExited?: () => void;
  title: string;
  children: ReactNode;
  role?: 'dialog' | 'alertdialog';
  describedBy?: string;
}

const Dialog: FC<DialogProps> = ({
  open,
  onClose,
  onExited,
  title,
  children,
  role = 'dialog',
  describedBy,
  className,
  ...restOfProps
}: DialogProps) => {
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
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        dialog.close();
        onExited?.();
      } else {
        dialog.setAttribute('data-closing', '');
        const timer = setTimeout(() => {
          dialog.removeAttribute('data-closing');
          dialog.close();
          onExited?.();
        }, TRANSITION_MS);
        return () => clearTimeout(timer);
      }
    }
  }, [open]);

  useEscapeDismiss(dialogRef, onClose);
  const backdropDismiss = useBackdropDismiss(onClose);

  return createPortal(
    <dialog
      ref={dialogRef}
      role={role}
      aria-labelledby={titleId}
      aria-describedby={describedBy}
      aria-modal="true"
      {...backdropDismiss}
      data-visible={isVisible || undefined}
      className={`fixed inset-0 m-auto bg-transparent p-0 w-5/6 max-w-sm backdrop:transform-gpu backdrop:bg-background backdrop:transition-opacity backdrop:duration-300 backdrop:opacity-0 data-visible:backdrop:opacity-100${className ? ` ${className}` : ''}`}
      {...restOfProps}
    >
      <h2 id={titleId} className="sr-only">
        {title}
      </h2>
      <div
        className={`bg-paper text-text-primary bg-background rounded-2xl shadow-2xl border border-secondary/20
          transition-all duration-300 ease-out transform-gpu
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <UNSAFE_PortalProvider getContainer={() => dialogRef.current}>{children}</UNSAFE_PortalProvider>
      </div>
    </dialog>,
    document.body
  );
};

export default Dialog;
