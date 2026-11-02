import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

interface DateTextProps {
  /** ISO date string; rendered as a localized, machine-readable <time>. */
  date?: string;
  /** Spells out the month and adds the time of day. */
  withTime?: boolean;
  className?: string;
}

/** Localized <time>. Renders nothing when the date is missing or unparseable. */
const DateText = ({ date, withTime = false, className }: DateTextProps) => {
  const { i18n } = useTranslation();

  const parsed = date ? new Date(date) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return null;

  return (
    <time dateTime={date} className={twMerge('text-xs text-muted', className)}>
      {withTime
        ? parsed.toLocaleString(i18n.language, { dateStyle: 'long', timeStyle: 'short' })
        : parsed.toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' })}
    </time>
  );
};

export default DateText;
