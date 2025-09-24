// Date

// Default date formats (fallback)
export const DEFAULT_FORMAT_DATE_TIME = 'YYYY-MM-DD HH:mm:ss';
export const DEFAULT_FORMAT_DATE_ONLY = 'YYYY-MM-DD';

// Locale-specific date formats
export const DATE_FORMATS = {
  en: {
    dateTime: DEFAULT_FORMAT_DATE_TIME,
    dateOnly: DEFAULT_FORMAT_DATE_ONLY,
  },
  de: {
    dateTime: 'DD.MM.YYYY HH:mm:ss',
    dateOnly: 'DD.MM.YYYY',
  },
  // Add more locales as needed
} as const;
