import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';
import Icon, { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';
import Chip from '../../button/Chip';

type StatProps = Omit<ComponentProps<typeof Chip>, 'children'> & {
  icon: ICON_TYPE;
  count: number;
  label: string;
  active?: boolean;
  /** Renders a plain count instead of a control, for metrics the current phase has frozen. */
  readOnly?: boolean;
};

const Stat = ({ icon, count, label, active = false, readOnly = false, className, ...chipProps }: StatProps) => {
  const tint = active ? 'text-error-fg' : 'text-muted';

  if (readOnly)
    return (
      <span className={twMerge('inline-flex items-center gap-1 min-h-11 p-1 px-1.5', tint, className)}>
        <Icon type={icon} className="text-xl" aria-hidden="true" />
        <span aria-hidden="true">{count}</span>
        <span className="sr-only">{label}</span>
      </span>
    );

  return (
    <Chip
      aria-label={label}
      aria-pressed={chipProps.onClick ? active : undefined}
      condensed
      className={twMerge('gap-1', tint, className)}
      startIcon={<Icon type={icon} className="text-xl" aria-hidden="true" />}
      {...chipProps}
    >
      <span aria-hidden="true">{count}</span>
    </Chip>
  );
};

export default Stat;
