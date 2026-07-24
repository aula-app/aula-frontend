import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  /** Full name used to derive the initials shown inside the avatar. */
  name: string;
  /** Size in pixels for both width and height. */
  size?: number;
  className?: string;
}

const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

/**
 * Circular initials avatar. Purely decorative — the accessible name is expected
 * to be provided as visible text next to it (see UserBar), so it is aria-hidden.
 */
const Avatar = ({ name, size = 32, className }: AvatarProps) => (
  <span
    aria-hidden="true"
    style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    className={twMerge(
      'inline-flex shrink-0 items-center justify-center rounded-full bg-secondary font-medium text-foreground select-none',
      className
    )}
  >
    {getInitials(name) || '?'}
  </span>
);

export default Avatar;
