import Chip from '@/v2/components/button/Chip';
import Icon, { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface ApprovalStatusProps {
  approved: -1 | 0 | 1;
  className?: string;
}

const STATUS: Record<-1 | 0 | 1, { icon: ICON_TYPE; label: string; className: string }> = {
  1: { icon: 'check', label: 'v2.scopes.ideas.status.approved', className: 'bg-success text-success-fg' },
  0: { icon: 'clock', label: 'v2.scopes.ideas.status.waiting', className: 'bg-muted text-foreground' },
  [-1]: { icon: 'close', label: 'v2.scopes.ideas.status.rejected', className: 'bg-error text-error-fg' },
};

/** Approval-phase badge marking an idea as approved, rejected, or awaiting review. */
const ApprovalStatus = ({ approved, className }: ApprovalStatusProps) => {
  const { t } = useTranslation();
  const { icon, label, className: statusClassName } = STATUS[approved];

  return (
    <Chip
      aria-label={t(label)}
      className={twMerge('gap-1 font-medium rounded-b-none', statusClassName, className)}
      startIcon={<Icon type={icon} className="text-2xl -ml-1" aria-hidden="true" />}
    >
      {t(label)}
    </Chip>
  );
};

export default ApprovalStatus;
