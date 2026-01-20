import { KeyboardEvent, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { announceToScreenReader } from '@/utils';

type KeyboardNavigationOptions<T> = {
  items: T[];
  containerRef: React.RefObject<HTMLElement>;
  onItemSelect?: (item: T, index: number) => void;
  onClose?: () => void;
  getItemLabel?: (item: T) => string;
};

/**
 * Custom hook for menu keyboard navigation (Arrow keys, Home, End, Enter, Escape)
 * @param options - Configuration for keyboard navigation
 * @returns Object with handleKeyDown function
 */
export const useMenuKeyboardNavigation = <T>({
  items,
  containerRef,
  onItemSelect,
  onClose,
  getItemLabel = () => '',
}: KeyboardNavigationOptions<T>) => {
  const { t } = useTranslation();
  const initialFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>, index: number) => {
      const itemCount = items.length;
      let nextIndex = index;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          nextIndex = (index + 1) % itemCount;
          break;
        case 'ArrowUp':
          event.preventDefault();
          nextIndex = (index - 1 + itemCount) % itemCount;
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = itemCount - 1;
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          onItemSelect?.(items[index], index);
          announceToScreenReader(
            t('ui.accessibility.menuItemSelected', {
              item: getItemLabel(items[index]),
            }),
            'polite'
          );
          break;
        case 'Escape':
          event.preventDefault();
          onClose?.();
          announceToScreenReader(t('ui.accessibility.menuClosed'), 'polite');
          break;
        default:
          break;
      }

      // If the index changed, focus the new item
      if (nextIndex !== index) {
        const menuItems = containerRef.current?.querySelectorAll('[role="menuitem"]');
        if (menuItems && menuItems[nextIndex]) {
          (menuItems[nextIndex] as HTMLElement).focus();
        }
      }
    },
    [items, onItemSelect, onClose, t, containerRef, getItemLabel]
  );

  const setItemRef = (index: number, currentIndex: number) => (element: HTMLElement | null) => {
    if (index === currentIndex) {
      initialFocusRef.current = element;
    }
  };

  return {
    handleKeyDown,
    initialFocusRef,
    setItemRef,
  };
};
