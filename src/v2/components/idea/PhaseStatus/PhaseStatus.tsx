import Chip from '@/v2/components/button/Chip';
import Icon from '@/v2/components/ui/Icon/Icon';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { PhaseStatus as PhaseStatusType } from './getPhaseStatus';

interface PhaseStatusProps {
  /** Descriptor from `getPhaseStatus`. */
  status: PhaseStatusType;
  className?: string;
}

/** Phase status badge sitting on top of an idea bubble. */
const PhaseStatus = ({ status, className }: PhaseStatusProps) => {
  const { t } = useTranslation();

  return (
    <Chip
      aria-label={t(status.label)}
      className={twMerge('text-xs gap-1 font-medium rounded-b-none', status.colors, className)}
      startIcon={<Icon type={status.icon} className="-mx-1" aria-hidden="true" />}
    >
      {t(status.label)}
    </Chip>
  );
};

export default PhaseStatus;
