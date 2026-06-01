import { usePlacement } from '@/v2/utils/placement';
import React, { ReactNode } from 'react';
import { useDropdown } from './useDropdown';

interface DropdownProps {
  children: React.ReactElement;
  content: ReactNode;
  'aria-label'?: string;
}

const Dropdown = ({ children, content, 'aria-label': ariaLabel }: DropdownProps) => {
  const { isOpen, toggle, close, focusTrigger, wrapperRef } = useDropdown();
  const { verticalClass, horizontalClass, cornerClass, originClass } = usePlacement(wrapperRef);

  const panel = wrapperRef.current?.querySelector('[role="listbox"]');

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
    'aria-haspopup': 'listbox',
  });

  return (
    <div ref={wrapperRef} className="relative inline-flex items-center justify-center">
      {trigger}
      <div
        role="listbox"
        aria-label={ariaLabel}
        inert={!isOpen ? '' : undefined}
        onBlur={(e) => {
          // Panel lost focus to somewhere outside the whole component → close and return focus to trigger
          if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
            close();
            focusTrigger();
          }
        }}
        className={`absolute z-50 min-w-max rounded-2xl overflow-clip bg-paper text-text-primary shadow-md p-0.5
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
