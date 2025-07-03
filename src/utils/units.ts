// Date

// Default date formats (fallback)
export const DEFAULT_FORMAT_DATE_TIME = 'YYYY-MM-DD HH:mm:ss';
export const DEFAULT_FORMAT_DATE_ONLY = 'YYYY-MM-DD';

// Locale-specific date formats
export const DATE_FORMATS = {
  en: {
    dateTime: 'MM-DD-YYYY hh:mm:ss A', // US format with AM/PM
    dateOnly: 'MM-DD-YYYY',
  },
  de: {
    dateTime: 'DD.MM.YYYY HH:mm:ss', // German format
    dateOnly: 'DD.MM.YYYY',
  },
  // Add more locales as needed
} as const;
