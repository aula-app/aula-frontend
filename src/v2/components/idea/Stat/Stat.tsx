import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';
import Icon, { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';
import Chip from '../../button/Chip';

type StatProps = Omit<ComponentProps<typeof Chip>, 'children'> & {
  icon: ICON_TYPE;
  count: number;
  label: string;
  active?: boolean;
};

const Stat = ({ icon, count, label, active = false, className, ...chipProps }: StatProps) => (
  <Chip
    aria-label={label}
    aria-pressed={chipProps.onClick ? active : undefined}
    condensed
    className={twMerge('gap-1', active ? 'text-error-fg' : 'text-muted', className)}
    startIcon={<Icon type={icon} className="text-xl" aria-hidden="true" />}
    {...chipProps}
  >
    <span aria-hidden="true">{count}</span>
  </Chip>
);

export default Stat;
