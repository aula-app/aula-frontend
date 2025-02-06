import { format } from 'date-fns';

/**
 * Main Data and Time conversion utility to keep formats the same across entire Application
 * @param {string|object} dateOrString - date to show as UTC string or Date object instance
 * @param {string} [dateFormat] - time conversion template in 'date-fns' format, `FORMAT_DATE_TIME` by default
 * @param {string} [fallbackValue] - optional fallback value if data conversion is not possible
 */

export const FORMAT_DATE_TIME = 'YYYY-MM-DD HH:mm:ss';
export const FORMAT_DATE_ONLY = 'YYYY-MM-DD';
export const FORMAT_TIME_ONLY = 'HH:mm:ss';

export function getDisplayDate(date: string): string {
  const displayDate = new Date(date);
  return `${displayDate.getFullYear()}/${displayDate.getMonth()}/${displayDate.getDate()}`;
}

export function dateToString(dateOrString: string | Date, dateFormat = FORMAT_DATE_TIME, fallbackValue = ''): string {
  const date = typeof dateOrString === 'object' ? dateOrString : new Date(dateOrString);
  let result;
  try {
    result = format(date, dateFormat);
  } catch (error) {
    result = fallbackValue;
  }
  return result;
}
