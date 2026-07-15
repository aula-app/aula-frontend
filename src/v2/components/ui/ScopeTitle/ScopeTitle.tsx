import { Children, ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import IconButton from '../../button/IconButton';
import Collapse from '../Collapse';
import Icon, { ICON_TYPE } from '../Icon/Icon';

type ScopeTitleProps = {
  /** Scope name, e.g. 'ideas' — resolves the icon and the v2.scopes.<scope> label. */
  scope: ICON_TYPE;
  count?: number;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  /** Collapsible controls (search, sort, …). Their presence enables the toggle button. */
  children?: ReactNode;
  /** Notified when the controls are toggled open or closed. */
  onToggle?: (open: boolean) => void;
};

const ScopeTitle = ({ scope, count, as: Heading = 'h1', className, children, onToggle }: ScopeTitleProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const hasControls = Children.toArray(children).length > 0;
  const toggleLabel = t(isOpen ? 'v2.ui.actions.close' : 'v2.ui.actions.search');

  useEffect(() => {
    if (isOpen) panelRef.current?.querySelector<HTMLElement>('input, select, textarea, button')?.focus();
  }, [isOpen]);

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    onToggle?.(next);
  };

  return (
    <div className="flex flex-col p-2 pb-0 sm:p-4 sm:pb-0">
      <div className="flex justify-between items-center">
        <Heading className={twMerge('flex items-center gap-2 capitalize', className)}>
          <Icon type={scope} className="mb-3" />
          {count !== undefined && <span>{count}</span>}
          <span>{t(`v2.scopes.${scope}.${count === 1 ? 'singular' : 'plural'}`)}</span>
        </Heading>
        {hasControls && (
          <IconButton aria-label={toggleLabel} hint={toggleLabel} aria-expanded={isOpen} onClick={toggle}>
            <Icon type={isOpen ? 'close' : 'search'} size="1.5em" />
          </IconButton>
        )}
      </div>
      {hasControls && (
        <Collapse open={isOpen} innerClass="px-1 pt-2">
          <div ref={panelRef} className="flex gap-2">
            {children}
          </div>
        </Collapse>
      )}
    </div>
  );
};

export default ScopeTitle;
