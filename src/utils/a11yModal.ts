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

  // Handle keyboard events to trap focus
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!modalRef.current || e.key !== 'Tab') return;

    const focusableElements = modalRef.current.querySelectorAll(FOCUSABLE_ELEMENTS);
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
  }, [modalRef]);

  // Set up focus trap when modal opens
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element to restore focus later
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Set focus on the initial element or the first focusable element
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(FOCUSABLE_ELEMENTS);
        (focusableElements[0] as HTMLElement)?.focus();
      }
      
      // Add event listener for keyboard navigation
      document.addEventListener('keydown', handleKeyDown);
    } else {
      // Restore focus when the modal closes
      if (finalFocusRef?.current) {
        finalFocusRef.current.focus();
      } else if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
      
      // Remove event listener
      document.removeEventListener('keydown', handleKeyDown);
    }
    
    // Clean up on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, modalRef, initialFocusRef, finalFocusRef, handleKeyDown]);
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
  useEffect(() => {
    if (isOpen) {
      // Announce modal opening
      announceToScreenReader(
        translationFunction('ui.accessibility.modalOpened', { title }), 
        'assertive'
      );
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