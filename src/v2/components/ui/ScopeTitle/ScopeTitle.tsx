import { TEST_IDS } from '@/test-ids';
import { Children, ReactNode, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import IconButton from '../../button/IconButton';
import Collapse from '../Collapse';
import Icon, { ICON_TYPE } from '../Icon/Icon';

type ScopeTitleProps = {
  /** Scope name, e.g. 'ideas' — resolves the icon and the v2.scopes.<scope> label. */
  scope: ICON_TYPE;
  count?: number;
  /** Full count before filtering. When it differs from `count`, the title reads "N of M". */
  total?: number;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  /** Collapsible controls (search, sort, …). Their presence enables the toggle button. */
  children?: ReactNode;
  /** Notified when the controls are toggled open or closed. */
  onToggle?: (open: boolean) => void;
  /** Whether the controls start expanded, e.g. to reveal a restored search. */
  defaultOpen?: boolean;
};

const ScopeTitle = ({
  scope,
  count,
  total,
  as: Heading = 'h1',
  className,
  children,
  onToggle,
  defaultOpen = false,
}: ScopeTitleProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);
  const panelId = useId();

  const isFiltered = total !== undefined && total !== count;
  const nounCount = isFiltered ? total : count;
  const hasControls = Children.toArray(children).length > 0;
  const toggleLabel = t(isOpen ? 'v2.ui.actions.close' : 'v2.ui.actions.search');

  useEffect(() => {
    // Skip the first run so a restored-open panel doesn't steal focus (and
    // scroll itself into view) on mount, which would fight scroll restoration.
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
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
        <Heading className={twMerge('flex items-center gap-2', className)}>
          <Icon type={scope} className="mb-3" />
          {count !== undefined && <span>{isFiltered ? t('v2.ui.count.ofTotal', { count, total }) : count}</span>}
          <span className="capitalize">{t(`v2.scopes.${scope}.${nounCount === 1 ? 'singular' : 'plural'}`)}</span>
        </Heading>
        {hasControls && (
          <IconButton
            aria-label={toggleLabel}
            hint={toggleLabel}
            aria-expanded={isOpen}
            aria-controls={panelId}
            data-testid={TEST_IDS.SEARCH_BUTTON}
            onClick={toggle}
          >
            <Icon type={isOpen ? 'close' : 'search'} size="1.5em" />
          </IconButton>
        )}
      </div>
      {hasControls && (
        <Collapse
          open={isOpen}
          id={panelId}
          role="search"
          aria-label={t('v2.ui.actions.search')}
          data-testid={TEST_IDS.SCOPE_CONTROLS}
        >
          <div ref={panelRef} className="flex items-center gap-2 pb-1">
            {children}
          </div>
        </Collapse>
      )}
    </div>
  );
};

export default ScopeTitle;
