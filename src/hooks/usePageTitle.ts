import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { APP_TITLE } from '@/config';

/**
 * Custom hook to set the page title dynamically (WCAG 2.4.2)
 * @param titleKey - Translation key for the page title
 * @param params - Optional parameters for title interpolation
 *
 * @example
 * usePageTitle('pageTitles.messages'); // "Nachrichten - aula"
 * usePageTitle('pageTitles.settings.profile', { name: 'Max' }); // "Profil: Max - aula"
 */
export const usePageTitle = (titleKey?: string, params?: Record<string, string | number>) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (titleKey) {
      const pageTitle = params ? t(titleKey, params) : t(titleKey);
      document.title = `${pageTitle} - ${APP_TITLE}`;
    } else {
      // Fallback to just app name if no titleKey provided
      document.title = APP_TITLE;
    }
  }, [titleKey, t, params]);
};
