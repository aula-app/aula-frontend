import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  /** Full name used to derive the initials shown inside the avatar. */
  name: string;
  /** Size in pixels for both width and height. */
  size?: number;
  className?: string;
  /** Image shown in place of the initials; they come back if it fails to load. */
  src?: string;
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
const Avatar = ({ name, size = 32, className, src }: AvatarProps) => {
  const [failed, setFailed] = useState<string | null>(null);
  const showImage = !!src && failed !== src;

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      className={twMerge(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary font-medium text-shade select-none',
        className
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          width={size}
          height={size}
          className="size-full object-cover"
          onError={() => setFailed(src)}
        />
      ) : (
        getInitials(name) || '?'
      )}
    </span>
  );
};

export default Avatar;
