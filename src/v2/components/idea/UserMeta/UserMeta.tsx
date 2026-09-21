import { twMerge } from 'tailwind-merge';
import DateText from '@/v2/components/ui/DateText';

interface UserMetaProps {
  /** Display name of the user. */
  name: string;
  /** ISO date string; rendered as a localized, machine-readable <time>. */
  date?: string;
  className?: string;
}

/** Display name over an optional date. Pairs with Avatar; see UserBar for the two combined. */
const UserMeta = ({ name, date, className }: UserMetaProps) => (
  <div className={twMerge('flex flex-col min-w-0 leading-tight', className)}>
    <span className="text-sm text-foreground font-bold truncate">{name}</span>
    <DateText date={date} />
  </div>
);

export default UserMeta;
