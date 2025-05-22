import dayjs from 'dayjs';

/**
 * Main Data and Time conversion utility to keep formats the same across entire Application
 * @param {string|object} dateOrString - date to show as UTC string or Date object instance
 * @param {string} [dateFormat] - time conversion template in 'dayjs' format, `FORMAT_DATE_TIME` by default
 * @param {string} [fallbackValue] - optional fallback value if data conversion is not possible
 */

export const FORMAT_DATE_TIME = 'YYYY-MM-DD HH:mm:ss';
export const FORMAT_DATE_ONLY = 'YYYY-MM-DD';
export const FORMAT_TIME_ONLY = 'HH:mm:ss';

export function getDisplayDate(date: string): string {
  const displayDate = dayjs(date);
  return `${displayDate.year()}/${displayDate.month() + 1}/${displayDate.date()}`;
}

export function dateToString(dateOrString: string | Date, dateFormat = FORMAT_DATE_TIME, fallbackValue = ''): string {
  let date = typeof dateOrString === 'object' ? dayjs(dateOrString) : dayjs(dateOrString);
  let result;
  try {
    result = date.format(dateFormat);
  } catch (error) {
    result = fallbackValue;
  }
  return result;
}
