import { twMerge } from 'tailwind-merge';
import Icon, { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';

interface StatProps {
  /** Icon representing the metric (e.g. "heart", "voting", "discussion"). */
  icon: ICON_TYPE;
  /** Numeric value shown next to the icon. */
  count: number;
  /** Full accessible label describing the metric, e.g. "3 likes". */
  label: string;
  className?: string;
}

/**
 * A single icon + count metric. The visible number is decorative; the full
 * label is exposed to assistive tech via visually-hidden text.
 */
const Stat = ({ icon, count, label, className }: StatProps) => (
  <span className={twMerge('inline-flex items-center gap-1 text-sm text-muted', className)}>
    <Icon type={icon} aria-hidden="true" />
    <span aria-hidden="true">{count}</span>
    <span className="sr-only">{label}</span>
  </span>
);

export default Stat;
