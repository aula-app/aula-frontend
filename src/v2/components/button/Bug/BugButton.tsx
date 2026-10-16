import Icon from '@/v2/components/ui/Icon';
import IconButton from '@/v2/components/button/IconButton';
import { useModal } from '@/v2/hooks/useModal';
import { BugForms } from '@/components/DataForms';
import { addBug, BugArguments } from '@/services/messages';
import { TEST_IDS } from '@/test-ids';
import { versionsRequest } from '@/services/requests-v2';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const BugButton = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { openModal, closeModal } = useModal();

  const onSubmit = async (data: BugArguments) => {
    const versions = await versionsRequest();
    const body = `
---
location: ${location.pathname}
userAgent: ${window.navigator.userAgent}
versions: ${JSON.stringify(versions)}
---
${data.content || ''}
    `;
    const request = await addBug({
      headline: t('scopes.bugs.headline', { var: location.pathname }),
      body,
    });
    if (!request.error) closeModal();
  };

  return (
    <IconButton
      data-testid={TEST_IDS.REPORT_BUG_BUTTON}
      aria-label={t('v2.ui.actions.report')}
      hint={t('v2.ui.actions.report')}
      onClick={() => openModal(t('v2.ui.actions.report'), <BugForms onClose={closeModal} onSubmit={onSubmit} />)}
    >
      <Icon type="bug" />
    </IconButton>
  );
};

BugButton.displayName = 'BugButton';

export default BugButton;
