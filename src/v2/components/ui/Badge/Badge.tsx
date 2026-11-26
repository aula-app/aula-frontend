import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  /** Hidden when zero or undefined. */
  count?: number;
  className?: string;
}

/** Count bubble pinned to the top-right of a relative parent. Hidden from assistive tech, so the
 * element it decorates must carry the count in its own label. */
const Badge = ({ count, className }: BadgeProps) =>
  count ? (
    <span
      aria-hidden="true"
      data-testid="badge"
      className={twMerge(
        'pointer-events-none absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1',
        'bg-primary text-primary-fg text-xs font-bold',
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  ) : null;

export default Badge;
