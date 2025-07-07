// Date

// Default date formats (fallback)
export const DEFAULT_FORMAT_DATE_TIME = 'YYYY-MM-DD HH:mm:ss';
export const DEFAULT_FORMAT_DATE_ONLY = 'YYYY-MM-DD';

// Locale-specific date formats
export const DATE_FORMATS = {
  en: {
    dateTime: 'DD MMMM YYYY HH:mm:ss',  // 01 June 2025 14:30:00
    dateOnly: 'DD MMMM YYYY',           // 01 June 2025
  },
  de: {
    dateTime: 'DD.MM.YYYY HH:mm:ss', // German format
    dateOnly: 'DD.MM.YYYY',
  },
  // Add more locales as needed
} as const;
