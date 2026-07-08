import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import Avatar from '@/v2/components/idea/Avatar';

interface UserBarProps {
  /** Display name of the user. */
  name: string;
  /** ISO date string; rendered as a localized, machine-readable <time>. */
  date?: string;
  className?: string;
}

/**
 * Author bar: initials avatar + display name + optional date.
 * Domain-agnostic — usable for any entity that has an author and a timestamp.
 */
const UserBar = ({ name, date, className }: UserBarProps) => {
  const { i18n } = useTranslation();

  const parsed = date ? new Date(date) : null;
  const isValidDate = parsed && !Number.isNaN(parsed.getTime());
  const formatted = isValidDate
    ? parsed.toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div className={twMerge('flex items-center gap-2', className)}>
      <Avatar name={name} />
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-medium text-foreground">{name}</span>
        {date && formatted && (
          <time dateTime={date} className="text-xs text-muted">
            {formatted}
          </time>
        )}
      </div>
    </div>
  );
};

export default UserBar;
