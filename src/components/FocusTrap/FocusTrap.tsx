import React from 'react';
import FocusLock from 'react-focus-lock';

interface FocusTrapProps {
  /**
   * The content to be wrapped in the focus trap
   */
  children: React.ReactNode;
  
  /**
   * Whether the focus trap is active
   */
  active?: boolean;
  
  /**
   * Whether to return focus to the previously focused element when the trap is deactivated
   */
  returnFocus?: boolean;
  
  /**
   * Whether to lock focus within the trap
   */
  disabled?: boolean;
}

/**
 * FocusTrap component - traps focus within a modal, dialog, or other component
 * 
 * This helps keyboard users by ensuring they can't tab outside of a modal
 * while it's open, which would create a confusing experience.
 */
const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  active = true,
  returnFocus = true,
  disabled = false,
}) => {
  return (
    <FocusLock 
      disabled={disabled || !active}
      returnFocus={returnFocus}
    >
      {children}
    </FocusLock>
  );
};

export default FocusTrap;