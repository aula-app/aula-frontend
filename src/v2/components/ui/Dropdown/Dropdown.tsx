import { usePlacement } from '@/v2/utils/placement';
import React, { ReactNode, useId } from 'react';
import { useDropdown } from './useDropdown';

interface DropdownProps {
  children: React.ReactElement;
  content: ReactNode;
  role?: 'listbox' | 'menu' | 'dialog';
  'aria-label'?: string;
}

const Dropdown = ({ children, content, role = 'listbox', 'aria-label': ariaLabel }: DropdownProps) => {
  const { isOpen, toggle, close, focusTrigger, wrapperRef } = useDropdown();
  const { verticalClass, horizontalClass, cornerClass, originClass } = usePlacement(wrapperRef);
  const panelId = useId();

  const panel = wrapperRef.current?.querySelector('[data-dropdown-panel]');

  const trigger = React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      toggle();
    },
    onBlur: (e: React.FocusEvent) => {
      children.props.onBlur?.(e);
      // Trigger lost focus to somewhere outside the panel → close, focus stays where it went
      if (!panel?.contains(e.relatedTarget as Node)) close();
    },
    'aria-expanded': isOpen,
    'aria-haspopup': role,
    'aria-controls': panelId,
  });

  return (
    <div ref={wrapperRef} className="relative inline-flex items-center justify-center">
      {trigger}
      <div
        id={panelId}
        data-dropdown-panel
        role={role}
        aria-label={ariaLabel}
        inert={!isOpen ? '' : undefined}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          close();
          focusTrigger();
        }}
        onBlur={(e) => {
          // Panel lost focus to somewhere outside the whole component → close and return focus to trigger
          if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
            close();
            focusTrigger();
          }
        }}
        className={`absolute z-50 min-w-max rounded-2xl overflow-clip bg-surface text-foreground shadow-md p-0.5
          transition-[opacity,transform] duration-150 transform-gpu
          ${verticalClass} ${horizontalClass} ${cornerClass} ${originClass}
          ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        {content}
      </div>
    </div>
  );
};

export default Dropdown;
