import { TEST_IDS } from '@/test-ids';
import { RoomPhases } from '@/types/SettingsTypes';
import { phases } from '@/utils';
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
  /** Phase id, e.g. '10'. When set, the title reads inside the phase sentence, e.g. "3 ideas in voting",
   * and the icon becomes the phase icon. */
  phase?: string;
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
  phase,
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

  // Inside a phase sentence the heading is about the phase, so the phase icon reads truer than the scope's.
  const iconType: ICON_TYPE = (phase && phases[phase as `${RoomPhases}`]) || scope;

  const nounLabel = t(`v2.scopes.${scope}.${nounCount === 1 ? 'singular' : 'plural'}`);
  const countLabel = count === undefined ? undefined : isFiltered ? t('v2.ui.count.ofTotal', { count, total }) : count;
  const phaseVar = [countLabel, nounLabel].filter((part) => part !== undefined && part !== '').join(' ');

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
        <Heading data-testid={TEST_IDS.SCOPE_TITLE} className={twMerge('flex min-w-0 items-center gap-2', className)}>
          <Icon type={iconType} size=".9em" className="shrink-0" />
          {phase ? (
            <span className="truncate first-letter:capitalize">
              {t(`phases.id-${phase}`, { var: phaseVar, defaultValue: phaseVar })}
            </span>
          ) : (
            <>
              {countLabel !== undefined && <span className="shrink-0">{countLabel}</span>}
              <span className="truncate capitalize">{nounLabel}</span>
            </>
          )}
        </Heading>
        {hasControls && (
          <IconButton
            aria-label={toggleLabel}
            hint={toggleLabel}
            aria-expanded={isOpen}
            aria-controls={panelId}
            data-testid={TEST_IDS.SEARCH_BUTTON}
            onClick={toggle}
            className="shrink-0"
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
