import { twMerge } from 'tailwind-merge';
import Avatar from '@/v2/components/idea/Avatar';
import UserMeta from '@/v2/components/idea/UserMeta';

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
const UserBar = ({ name, date, className }: UserBarProps) => (
  <div className={twMerge('flex items-center gap-2 min-w-0', className)}>
    <Avatar name={name} />
    <UserMeta name={name} date={date} />
  </div>
);

export default UserBar;
