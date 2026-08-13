import IconButton from '@/v2/components/button/IconButton';
import Collapse from '@/v2/components/ui/Collapse';
import { useDropdown } from '@/v2/components/ui/Dropdown/useDropdown';
import Icon from '@/v2/components/ui/Icon';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface MoreOptionsProps {
  /** Renders the action buttons; receives `close` to dismiss the menu after an action fires. */
  children: (close: () => void) => React.ReactNode;
  /** Classes for the wrapper. Defaults to `contents` so the toggle/panel join the parent layout. */
  wrapperClassName?: string;
  /** Classes for the toggle button (e.g. positioning). */
  className?: string;
  /** Classes for the collapsible panel wrapper. */
  collapseClassName?: string;
  /** Classes for the row that holds the action buttons. */
  panelClassName?: string;
  menuTestId?: string;
  panelTestId?: string;
}

const MoreOptions = ({
  children,
  wrapperClassName = 'contents',
  className,
  collapseClassName,
  panelClassName,
  menuTestId,
  panelTestId,
}: MoreOptionsProps) => {
  const { t } = useTranslation();

  const { isOpen, toggle, close, wrapperRef } = useDropdown();
  const panelId = useId();

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (isOpen && !event.currentTarget.contains(event.relatedTarget)) {
      close();
    }
  };

  return (
    <div ref={wrapperRef} className={wrapperClassName} onBlur={handleBlur}>
      <IconButton
        aria-label={t('v2.ui.button.more')}
        aria-expanded={isOpen}
        aria-controls={panelId}
        data-testid={menuTestId}
        onClick={toggle}
        className={className}
      >
        <Icon type={isOpen ? 'close' : 'more'} size="1.2em" />
      </IconButton>
      <Collapse
        open={isOpen}
        className={twMerge('justify-end', isOpen ? '-my-1' : undefined, collapseClassName)}
        data-testid={panelTestId}
      >
        <div
          className={twMerge('flex items-center justify-center gap-1', panelClassName)}
          id={panelId}
          data-dropdown-panel
        >
          {children(close)}
        </div>
      </Collapse>
    </div>
  );
};

export default MoreOptions;
