import { twMerge } from 'tailwind-merge';
import Icon, { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';
import Chip from '../../button/Chip';

interface StatProps {
  icon: ICON_TYPE;
  count: number;
  label: string;
  className?: string;
}

const Stat = ({ icon, count, label, className }: StatProps) => (
  <span className={twMerge('inline-flex items-center gap-1 text-muted', className)}>
    <Chip aria-label={label} className="gap-1" condensed>
      <Icon type={icon} className="text-xl" aria-hidden="true" />
      <span aria-hidden="true">{count}</span>
    </Chip>
  </span>
);

export default Stat;
