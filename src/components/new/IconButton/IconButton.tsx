import { Link, LinkProps } from 'react-router-dom';
import { ReactNode } from 'react';
import { useRipple } from '@/hooks/useRipple';

interface IconButtonLinkProps extends Omit<LinkProps, 'className'> {
  children: ReactNode;
  title?: string;
  className?: string;
  disabled?: boolean;
  testId?: string;
}

/**
 * A react-router-dom Link styled like MUI's IconButton with ripple effect
 * @component IconButtonLink
 */
const IconButtonLink: React.FC<IconButtonLinkProps> = ({
  children,
  title,
  className = '',
  disabled = false,
  testId,
  to,
  ...restOfProps
}) => {
  const { createRipple, RipplesContainer } = useRipple();

  // Generate a comprehensive testId from the 'to' path if not provided
  const resolvedTestId = testId ?? `icon-button-link-${String(to).replace(/\//g, '-').replace(/^-/, '')}`;

  if (disabled) {
    return (
      <span
        className={`
          inline-flex items-center justify-center rounded-full p-2
          text-gray-400 cursor-not-allowed opacity-40
          ${className}
        `}
        title={title}
        aria-label={title}
        aria-disabled="true"
        data-testid={`${resolvedTestId}-disabled`}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      to={to}
      className={`
        relative overflow-hidden max-h-full aspect-square p-2
        inline-flex items-center justify-center rounded-full
        text-current cursor-pointer select-none
        transition-[background-color] duration-150 ease-in-out
        hover:bg-black/[0.04] dark:hover:bg-white/[0.08]
        focus:outline-none focus-visible:bg-black/[0.12] dark:focus-visible:bg-white/[0.12]
        active:bg-black/[0.12] dark:active:bg-white/[0.12]
        ${className}
      `}
      title={title}
      aria-label={title}
      data-testid={resolvedTestId}
      onMouseDown={createRipple}
      {...restOfProps}
    >
      {children}
      <RipplesContainer />
    </Link>
  );
};

export default IconButtonLink;
