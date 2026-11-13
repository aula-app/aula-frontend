import Icon from '@/v2/components/ui/Icon/Icon';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { PhaseStatus as PhaseStatusType } from './getPhaseStatus';

interface PhaseStatusProps {
  /** Descriptor from `getPhaseStatus`. */
  status: PhaseStatusType;
  /** Drop the label and keep only the icon. Stays labelled for screen readers. */
  iconOnly?: boolean;
  className?: string;
}

/** Phase status badge sitting on top of an idea bubble. */
const PhaseStatus = ({ status, iconOnly = false, className }: PhaseStatusProps) => {
  const { t } = useTranslation();
  const label = t(status.label);

  return (
    <span
      role={iconOnly ? 'img' : undefined}
      aria-label={iconOnly ? label : undefined}
      className={twMerge(
        'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-2xl rounded-b-none p-1 px-3',
        'text-xs font-medium',
        status.colors,
        className
      )}
    >
      <Icon type={status.icon} className={iconOnly ? undefined : '-mx-1'} aria-hidden="true" />
      {!iconOnly && <span className="ml-1">{label}</span>}
    </span>
  );
};

export default PhaseStatus;
