import { TEST_IDS } from '@/test-ids';
import { Verdict } from '@/utils';
import DecisionBar from '@/v2/components/idea/DecisionBar';
import { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';
import { RejectionForm } from '@/v2/forms';
import { useModal } from '@/v2/hooks/useModal';
import { useTranslation } from 'react-i18next';
import { ApprovalState } from './useIdeaApproval';

const CHOSEN_APPROVED = 'bg-success text-success-fg hover:bg-success-active';
const CHOSEN_REJECTED = 'bg-error text-error-fg hover:bg-error-active';

interface ApprovalBarProps {
  /** Decision state from `useIdeaApproval`, owned by the caller so the status chip reads the same value. */
  approval: ApprovalState;
  /** Corner radius is the caller's, since the bar sits between other bands. */
  className?: string;
}

/** The approval-phase decision as one band: approved, or turned down with an argument. */
const ApprovalBar = ({ approval: { approved, comment, decide, pending }, className }: ApprovalBarProps) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();

  const options: { value: Verdict; icon: ICON_TYPE; label: string; colors: string; testId: string }[] = [
    {
      value: 1,
      icon: 'star',
      label: t('v2.scopes.ideas.status.approved'),
      colors: CHOSEN_APPROVED,
      testId: TEST_IDS.APPROVE_BUTTON,
    },
    {
      value: -1,
      icon: 'noSymbol',
      label: t('v2.scopes.ideas.status.rejected'),
      colors: CHOSEN_REJECTED,
      testId: TEST_IDS.REJECT_BUTTON,
    },
  ];

  // A rejection always goes through the dialog, re-picked or not: the argument is what the
  // idea's author is left with, so it is never written without the moderator seeing it.
  const choose = (value: Verdict) => {
    if (value === 1) {
      decide(1);
      return;
    }

    openModal(
      t('v2.scopes.ideas.approval.reason'),
      <RejectionForm
        defaultValue={comment}
        onSubmit={async (reason) => {
          await decide(-1, reason);
          closeModal();
        }}
        onCancel={closeModal}
      />
    );
  };

  return (
    <DecisionBar
      label={t('v2.scopes.ideas.approval.decision')}
      options={options}
      value={approved}
      onChange={choose}
      disabled={pending}
      className={className}
    />
  );
};

export default ApprovalBar;
