import IconButton from '@/v2/components/button/IconButton';
import Collapse from '@/v2/components/ui/Collapse';
import { useDropdown } from '@/v2/components/ui/Dropdown/useDropdown';
import Icon from '@/v2/components/ui/Icon';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

/** Parent classes for a `corner` MoreOptions and the content beside it. */
export const moreOptionsHost = 'relative group/more-options';

/** Content classes beside a `corner` MoreOptions: clears the toggle, and drops below the action row while open. */
export const moreOptionsClearance =
  'pr-7 transition-[padding] duration-150 ease-in-out group-has-aria-expanded/more-options:pt-8';

interface MoreOptionsProps {
  /** Renders the action buttons; receives `close` to dismiss the menu after an action fires. */
  children: (close: () => void) => React.ReactNode;
  /** Pin to the top-right corner of a `moreOptionsHost` parent, over content using `moreOptionsClearance`. */
  corner?: boolean;
  /** Classes for the wrapper. Defaults to `contents` so the toggle/panel join the parent layout. */
  buttonClassName?: string;
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
  corner = false,
  buttonClassName,
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
    <div
      ref={wrapperRef}
      className={twMerge('flex flex-row-reverse', corner && 'absolute top-0.5 right-1.5 z-10', className)}
      onBlur={handleBlur}
    >
      <IconButton
        aria-label={t('v2.ui.button.more')}
        aria-expanded={isOpen}
        aria-controls={panelId}
        data-testid={menuTestId}
        onClick={toggle}
        className={buttonClassName}
        hint={t('v2.ui.button.more')}
      >
        <Icon type={isOpen ? 'close' : 'more'} size="1.2em" />
      </IconButton>
      <Collapse
        open={isOpen}
        orientation="horizontal"
        className={twMerge('justify-end', collapseClassName)}
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
