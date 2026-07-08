import { ReportForms } from '@/components/DataForms';
import { addReport, ReportArguments } from '@/services/messages';
import { IdeaType } from '@/types/Scopes';
import Icon from '@/v2/components/ui/Icon';
import IconButton from '@/v2/components/button/IconButton';
import { useModal, useToast } from '@/v2/hooks';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface ReportIdeaButtonProps {
  idea: IdeaType;
  /** Notify the parent that the action fired (e.g. to close a menu). */
  onOpen?: () => void;
}

/**
 * Reports an idea for moderation. Reuses the v1 `ReportForms` (claim picker +
 * note) for now; the submitted claim and location are folded into the report
 * body, matching the v1 report flow.
 */
const ReportIdeaButton = ({ idea, onOpen }: ReportIdeaButtonProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { openModal, closeModal } = useModal();
  const { toast } = useToast();

  const handleSubmit = async (data: ReportArguments) => {
    const body = `
---
claim: ${t(`forms.report.${data.report}`)}
location: ${location.pathname}
---
${data.content || ''}
    `;

    const response = await addReport({
      headline: t('scopes.reports.headline', { var: `${t('scopes.ideas.name')}: ${idea.title}` }),
      body,
    });

    if (response.error) {
      toast.error(response.error || t('errors.failed'));
      return;
    }

    toast.success(t('ui.accessibility.formSubmitted'));
    closeModal();
  };

  const handleClick = () => {
    onOpen?.();
    openModal(t('actions.contentReport'), <ReportForms onClose={closeModal} onSubmit={handleSubmit} />);
  };

  return (
    <IconButton dense aria-label={t('v2.ui.button.report')} onClick={handleClick}>
      <Icon type="report" size="1.2em" />
    </IconButton>
  );
};

export default ReportIdeaButton;
