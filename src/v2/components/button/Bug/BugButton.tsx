import Icon from '@/v2/components/ui/Icon';
import IconButton from '@/v2/components/button/IconButton';
import Modal from '@/v2/components/ui/Modal';
import { BugForms } from '@/components/DataForms';
import { addBug, BugArguments } from '@/services/messages';
import { TEST_IDS } from '@/test-ids';
import { versionsRequest } from '@/services/requests-v2';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const BugButton = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);

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
    if (!request.error) setOpen(false);
  };

  return (
    <>
      <IconButton
        data-testid={TEST_IDS.REPORT_BUG_BUTTON}
        aria-label={t('v2.ui.actions.report')}
        hint={t('v2.ui.actions.report')}
        onClick={() => setOpen(true)}
      >
        <Icon type="bug" />
      </IconButton>
      <Modal
        open={isOpen}
        onClose={() => setOpen(false)}
        title={t('v2.ui.actions.report')}
        data-testid={TEST_IDS.BUG_DIALOG}
      >
        <BugForms onClose={() => setOpen(false)} onSubmit={onSubmit} />
      </Modal>
    </>
  );
};

BugButton.displayName = 'BugButton';

export default BugButton;
