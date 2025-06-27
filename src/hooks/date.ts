import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

/**
 * Main Data and Time conversion utility to keep formats the same across entire Application
 * @param {string|object} dateOrString - date to show as UTC string or Date object instance
 * @param {string} [dateFormat] - time conversion template in 'dayjs' format, `FORMAT_DATE_TIME` by default
 * @param {string} [fallbackValue] - optional fallback value if data conversion is not possible
 */

// Default formats (fallback)
export const DEFAULT_FORMAT_DATE_TIME = 'YYYY-MM-DD HH:mm:ss';
export const DEFAULT_FORMAT_DATE_ONLY = 'YYYY-MM-DD';

// Locale-specific date formats
const DATE_FORMATS = {
  en: {
    dateTime: 'MM/DD/YYYY hh:mm:ss A', // US format with AM/PM
    dateOnly: 'MM/DD/YYYY',
  },
  de: {
    dateTime: 'DD.MM.YYYY HH:mm:ss', // German format
    dateOnly: 'DD.MM.YYYY',
  },
  // Add more locales as needed
} as const;

/**
 * Get date format based on current language
 */
export function getDateFormat(type: 'dateTime' | 'dateOnly' = 'dateTime'): string {
  try {
    // This will only work inside React components
    const { i18n } = useTranslation();
    const language = i18n.language.split('-')[0] as keyof typeof DATE_FORMATS; // Get base language (en from en-US)

    if (language in DATE_FORMATS) {
      return DATE_FORMATS[language][type];
    }
  } catch (error) {
    // Fallback for non-React contexts
  }

  // Fallback to default formats
  return type === 'dateTime' ? DEFAULT_FORMAT_DATE_TIME : DEFAULT_FORMAT_DATE_ONLY;
}

/**
 * Get date format based on provided language
 */
export function getDateFormatForLanguage(language: string, type: 'dateTime' | 'dateOnly' = 'dateTime'): string {
  const lang = language.split('-')[0] as keyof typeof DATE_FORMATS;

  if (lang in DATE_FORMATS) {
    return DATE_FORMATS[lang][type];
  }

  return type === 'dateTime' ? DEFAULT_FORMAT_DATE_TIME : DEFAULT_FORMAT_DATE_ONLY;
}

// Dynamic format getters for backwards compatibility (deprecated - use useDateFormatters hook instead)
// Note: These will use default language on first import, use the hook or language-specific functions for reactive formatting
export const FORMAT_DATE_TIME = DEFAULT_FORMAT_DATE_TIME;
export const FORMAT_DATE_ONLY = DEFAULT_FORMAT_DATE_ONLY;

export function getDisplayDate(date: string): string {
  const displayDate = dayjs(date);
  return displayDate.format(getDateFormat('dateTime'));
}

/**
 * Get display date with specific language
 */
export function getDisplayDateForLanguage(date: string, language: string): string {
  const displayDate = dayjs(date);
  return displayDate.format(getDateFormatForLanguage(language, 'dateTime'));
}

/**
 * Get display date (date only) with current language
 */
export function getDisplayDateOnly(date: string): string {
  const displayDate = dayjs(date);
  return displayDate.format(getDateFormat('dateOnly'));
}

/**
 * Get display date (date only) with specific language
 */
export function getDisplayDateOnlyForLanguage(date: string, language: string): string {
  const displayDate = dayjs(date);
  return displayDate.format(getDateFormatForLanguage(language, 'dateOnly'));
}

/**
 * Hook for getting locale-aware date formatters
 * Use this in React components for reactive date formatting
 */
export function useDateFormatters() {
  const { i18n } = useTranslation();

  return {
    formatDateTime: (date: string) => getDisplayDateForLanguage(date, i18n.language),
    formatDateOnly: (date: string) => getDisplayDateOnlyForLanguage(date, i18n.language),
    getDateTimeFormat: () => getDateFormatForLanguage(i18n.language, 'dateTime'),
    getDateOnlyFormat: () => getDateFormatForLanguage(i18n.language, 'dateOnly'),
  };
}
