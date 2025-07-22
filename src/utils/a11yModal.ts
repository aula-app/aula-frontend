/**
 * Accessibility utilities for modal dialogs
 */
import { announceToScreenReader } from './accessibility';
import { useCallback, useEffect, useRef } from 'react';

const FOCUSABLE_ELEMENTS = 
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Traps focus within a modal dialog
 * @param isOpen Whether the modal is open
 * @param modalRef Ref to the modal container
 * @param initialFocusRef Optional ref to the element that should receive initial focus
 * @param finalFocusRef Optional ref to the element that should receive focus when the modal closes
 */
export const useFocusTrap = (
  isOpen: boolean,
  modalRef: React.RefObject<HTMLElement>,
  initialFocusRef?: React.RefObject<HTMLElement>,
  finalFocusRef?: React.RefObject<HTMLElement>
) => {
  // Store the element that had focus before opening the modal
  const previousFocusRef = useRef<HTMLElement | null>(null);
  // Remember if this modal has been open before (for focus return)
  const wasOpen = useRef(false);

  // Get all focusable elements within the modal
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    return Array.from(modalRef.current.querySelectorAll(FOCUSABLE_ELEMENTS));
  }, [modalRef]);

  // Handle keyboard events to trap focus
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!modalRef.current || e.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // If shift+tab on first element, move to last element
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    } 
    // If tab on last element, move to first element
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  }, [modalRef, getFocusableElements]);

  // Set initial focus
  const setInitialFocus = useCallback(() => {
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else if (modalRef.current) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      } else {
        // If no focusable elements, focus the modal itself to keep focus trapped
        modalRef.current.setAttribute('tabindex', '-1');
        modalRef.current.focus();
      }
    }
  }, [modalRef, initialFocusRef, getFocusableElements]);

  // Save the element that had focus before opening the modal
  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      wasOpen.current = true;
    } else if (!isOpen) {
      wasOpen.current = false;
    }
  }, [isOpen]);

  // Handle focus when the modal content changes
  useEffect(() => {
    if (isOpen) {
      // Delay focus slightly to allow any dynamic content to render
      const focusTimer = setTimeout(() => {
        setInitialFocus();
      }, 50);
      
      return () => clearTimeout(focusTimer);
    }
  }, [isOpen, setInitialFocus]);

  // Set up focus trap when modal opens and restore focus when it closes
  useEffect(() => {
    if (isOpen) {
      // Add event listener for keyboard navigation
      document.addEventListener('keydown', handleKeyDown);
    } else if (wasOpen.current) {
      // Need to delay focus return slightly to allow animations to complete
      // and ensure the proper focus order when multiple modals are in play
      const returnFocusTimer = setTimeout(() => {
        // First try the specified final focus element
        if (finalFocusRef?.current && finalFocusRef.current.isConnected) {
          finalFocusRef.current.focus();
        } 
        // Then try the element that had focus before opening
        else if (previousFocusRef.current && previousFocusRef.current.isConnected) {
          previousFocusRef.current.focus();
        }
        // If neither is available, try to find a sensible fallback
        else {
          // Look for a main content area
          const mainContent = document.querySelector('main');
          if (mainContent) {
            // If main content has focusable elements, focus the first one
            const mainFocusable = mainContent.querySelector(FOCUSABLE_ELEMENTS) as HTMLElement;
            if (mainFocusable) {
              mainFocusable.focus();
            } else {
              // Otherwise, make the main content focusable and focus it
              mainContent.setAttribute('tabindex', '-1');
              (mainContent as HTMLElement).focus();
              // Remove the tabindex after focus to avoid confusing screen readers
              setTimeout(() => mainContent.removeAttribute('tabindex'), 100);
            }
          } else {
            // Last resort: focus the body
            document.body.setAttribute('tabindex', '-1');
            document.body.focus();
            // Remove the tabindex after focus
            setTimeout(() => document.body.removeAttribute('tabindex'), 100);
          }
        }
      }, 100); // 100ms delay seems to work well with most animations
      
      // Remove event listener
      document.removeEventListener('keydown', handleKeyDown);
      
      return () => clearTimeout(returnFocusTimer);
    }
    
    // Clean up on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, modalRef, initialFocusRef, finalFocusRef, handleKeyDown, setInitialFocus]);

  // Prevent screen readers from accessing content outside the modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // Get all elements in the document that should be hidden from screen readers when modal is open
    const rootNodes = document.querySelectorAll('body > *');
    const modalNode = modalRef.current.closest('[role="dialog"], [role="alertdialog"]') || modalRef.current;
    
    // Store the original aria-hidden values
    const originalValues = new Map<Element, string | null>();
    
    // Hide all other root nodes from screen readers
    rootNodes.forEach(node => {
      if (node.contains(modalNode) || modalNode.contains(node)) return;
      
      originalValues.set(node, node.getAttribute('aria-hidden'));
      node.setAttribute('aria-hidden', 'true');
    });
    
    return () => {
      // Restore original aria-hidden values
      rootNodes.forEach(node => {
        if (node.contains(modalNode) || modalNode.contains(node)) return;
        
        const originalValue = originalValues.get(node);
        if (originalValue === null) {
          node.removeAttribute('aria-hidden');
        } else if (originalValue !== undefined) {
          node.setAttribute('aria-hidden', originalValue);
        }
      });
    };
  }, [isOpen, modalRef]);
};

/**
 * Announces a modal's open/close state to screen readers
 * @param isOpen Whether the modal is open
 * @param title The title of the modal for announcements
 * @param translationFunction Translation function
 */
export const useModalAnnouncement = (
  isOpen: boolean,
  title: string,
  translationFunction: (key: string, options?: any) => string
) => {
  // Track previous open state to detect changes
  const wasOpen = useRef(false);
  
  useEffect(() => {
    // Only announce when state changes
    if (isOpen && !wasOpen.current) {
      // Announce modal opening
      announceToScreenReader(
        translationFunction('ui.accessibility.modalOpened', { title }), 
        'assertive'
      );
      wasOpen.current = true;
    } else if (!isOpen && wasOpen.current) {
      // Announce modal closing
      announceToScreenReader(
        translationFunction('ui.accessibility.modalClosed'), 
        'polite'
      );
      wasOpen.current = false;
    }
  }, [isOpen, title, translationFunction]);
};

/**
 * Handles escape key to close modal
 * @param isOpen Whether the modal is open
 * @param onClose Function to call to close the modal
 */
export const useEscapeKey = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
};