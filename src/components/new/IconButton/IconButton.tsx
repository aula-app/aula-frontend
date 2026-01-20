import { Link } from 'react-router-dom';
import { ReactNode, ButtonHTMLAttributes } from 'react';
import { useRipple } from '@/hooks/useRipple';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  children: ReactNode;
  title?: string;
  className?: string;
  disabled?: boolean;
  testId?: string;
  to?: string; // If provided, renders as a Link
}

/**
 * Flexible icon button that renders as a Link (if 'to' prop) or as a button
 * Styled like MUI's IconButton with ripple effect
 * @component IconButton
 */
const IconButton: React.FC<IconButtonProps> = ({
  children,
  title,
  className = '',
  disabled = false,
  testId,
  to,
  onClick,
  ...restOfProps
}) => {
  const { createRipple, RipplesContainer } = useRipple();

  const baseClassName = `
    relative overflow-hidden aspect-square p-2
    inline-flex items-center justify-center rounded-full
    text-current cursor-pointer select-none
    transition-[background-color] duration-150 ease-in-out
    hover:bg-black/[0.04] dark:hover:bg-white/[0.08]
    focus:outline-none focus-visible:bg-black/[0.12] dark:focus-visible:bg-white/[0.12]
    active:bg-black/[0.12] dark:active:bg-white/[0.12]
    ${className}
  `;

  const disabledClassName = `
    inline-flex items-center justify-center rounded-full p-2
    text-gray-400 cursor-not-allowed opacity-40
    ${className}
  `;

  const resolvedTestId =
    testId ??
    `icon-button-${String(to || 'button')
      .replace(/\//g, '-')
      .replace(/^-/, '')}`;

  if (disabled) {
    return (
      <span
        className={disabledClassName}
        title={title}
        aria-label={title}
        aria-disabled="true"
        data-testid={`${resolvedTestId}-disabled`}
      >
        {children}
      </span>
    );
  }

  // Render as Link if 'to' prop is provided
  if (to) {
    const { to: _to, ...linkProps } = restOfProps as any;
    return (
      <Link
        to={to}
        className={baseClassName}
        title={title}
        aria-label={title}
        data-testid={resolvedTestId}
        onMouseDown={createRipple}
        {...linkProps}
      >
        {children}
        <RipplesContainer />
      </Link>
    );
  }

  // Render as button otherwise
  return (
    <button
      className={baseClassName}
      title={title}
      aria-label={title}
      data-testid={resolvedTestId}
      onMouseDown={createRipple}
      onClick={onClick}
      {...(restOfProps as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
      <RipplesContainer />
    </button>
  );
};

export default IconButton;
