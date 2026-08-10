import { addReport, ReportArguments } from '@/services/messages';
import Icon from '@/v2/components/ui/Icon';
import IconButton from '@/v2/components/button/IconButton';
import { ReportForm } from '@/v2/forms';
import { useModal, useToast } from '@/v2/hooks';
import { TEST_IDS } from '@/test-ids';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface ReportButtonProps {
  /** Localized scope name for the report headline, e.g. `t('scopes.ideas.name')`. */
  scopeLabel: string;
  /** Title of the reported item, appended to the headline after the scope. */
  subject: string;
  /** Notify the parent that the action fired (e.g. to close a menu). */
  onOpen?: () => void;
}

/**
 * Reports an item for moderation. Reuses the v1 `ReportForms` (claim picker +
 * note) for now; the submitted claim and location are folded into the report
 * body, matching the v1 report flow.
 */
const ReportButton = ({ scopeLabel, subject, onOpen }: ReportButtonProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { openModal, closeModal } = useModal();
  const { toast } = useToast();

  const handleSubmit = async (data: ReportArguments): Promise<boolean> => {
    const body = `
---
claim: ${t(`forms.report.${data.report}`)}
location: ${location.pathname}
---
${data.content || ''}
    `;

    const response = await addReport({
      headline: t('scopes.reports.headline', { var: `${scopeLabel}: ${subject}` }),
      body,
    });

    if (response.error) {
      toast.error(response.error || t('errors.failed'));
      return false;
    }

    toast.success(t('ui.accessibility.formSubmitted'));
    closeModal();
    return true;
  };

  const handleClick = () => {
    onOpen?.();
    openModal(
      t('actions.contentReport'),
      <div data-testid={TEST_IDS.REPORT_DIALOG}>
        <ReportForm onSubmit={handleSubmit} onCancel={closeModal} />
      </div>
    );
  };

  return (
    <IconButton
      aria-label={t('v2.ui.button.report')}
      hint={t('v2.ui.button.report')}
      data-testid={TEST_IDS.REPORT_BUTTON}
      onClick={handleClick}
    >
      <Icon type="report" />
    </IconButton>
  );
};

export default ReportButton;
