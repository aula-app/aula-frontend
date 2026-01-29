import { App } from '@capacitor/app';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook to handle Android back button behavior
 * Navigates back in the app's history when possible,
 * exits the app only when on the root page
 */
export const useAndroidBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = App.addListener('backButton', ({ canGoBack }) => {
      // Check if we're on the root/home page
      const isRootPage = location.pathname === '/' || location.pathname === '';

      if (!canGoBack || isRootPage) {
        // If we're on the root page or can't go back, exit the app
        App.exitApp();
      } else {
        // Otherwise, navigate back in the app's history
        navigate(-1);
      }
    });

    // Cleanup listener on unmount
    return () => {
      handleBackButton.then((listener) => listener.remove());
    };
  }, [navigate, location.pathname]);
};
