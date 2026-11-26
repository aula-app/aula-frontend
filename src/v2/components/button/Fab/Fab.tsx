import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import Button from '@/v2/components/button/Button/Button';

type BaseFabProps = Omit<ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'children'> & {
  color?: 'primary' | 'secondary' | 'error';
  size?: 'small' | 'medium' | 'large';
  icon?: ReactNode;
  to?: string;
};

// Require aria-label when no children are provided (icon-only Fabs), same as Button
type FabProps = BaseFabProps &
  ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });

const sizeClasses = {
  small: 'size-10 min-w-10 min-h-10',
  medium: 'size-14',
  large: 'size-16',
};

const Fab = forwardRef<HTMLButtonElement, FabProps>(({ size = 'medium', icon, children, className, ...props }, ref) => {
  const classes = twMerge(
    'rounded-full p-0 shadow-sm hover:shadow-md',
    children ? 'h-14 gap-3 px-6' : sizeClasses[size],
    className
  );

  return (
    <Button ref={ref} className={classes} {...props}>
      {icon}
      {children}
    </Button>
  );
});

Fab.displayName = 'Fab';

export default Fab;
