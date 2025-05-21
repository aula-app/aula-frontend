/**
 * Accessibility utilities for dynamic content announcements and screen reader support
 */

/**
 * Announces a message to screen readers using the live region
 * @param message - The message to announce
 * @param type - The type of announcement (polite or assertive)
 */
export const announceToScreenReader = (message: string, type: 'polite' | 'assertive' = 'polite'): void => {
  const liveRegionId = type === 'assertive' ? 'a11y-status-announcer' : 'a11y-live-announcer';
  const liveRegion = document.getElementById(liveRegionId);
  
  if (liveRegion) {
    // Clear previous content and add new message
    liveRegion.textContent = '';
    
    // Use setTimeout to ensure screen readers register the change
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = message;
      }
    }, 100);
  }
};

/**
 * Announces loading state changes to screen readers
 * @param isLoading - Whether content is loading
 * @param resourceName - Optional name of the resource that's loading
 */
export const announceLoadingState = (isLoading: boolean, resourceName?: string): void => {
  const message = isLoading
    ? resourceName
      ? `Loading ${resourceName}...`
      : 'Loading...'
    : resourceName
      ? `${resourceName} loaded successfully`
      : 'Content loaded successfully';
      
  announceToScreenReader(message, 'assertive');
};