import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  /** Hidden when zero or undefined. */
  count?: number;
  /** Sits in the flow of a row instead of pinned to the parent's corner. */
  inline?: boolean;
  className?: string;
}

/** Count bubble pinned to the top-right of a relative parent. Hidden from assistive tech, so the
 * element it decorates must carry the count in its own label. */
const Badge = ({ count, inline = false, className }: BadgeProps) =>
  count ? (
    <span
      aria-hidden="true"
      data-testid="badge"
      className={twMerge(
        'pointer-events-none flex h-5 min-w-5 items-center justify-center rounded-full px-1',
        !inline && 'absolute -top-0.5 -right-0.5',
        'bg-primary text-primary-fg text-xs font-bold',
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  ) : null;

export default Badge;
