import { BugForms } from '@/components/DataForms';
import Icon from '@/components/new/Icon';
import IconButton from '@/components/new/IconButton';
import { addBug, BugArguments } from '@/services/messages';
import { Drawer, IconButtonProps } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { versionsRequest } from '@/services/requests-v2';

const BugButton = ({ disabled = false, ...restOfProps }: IconButtonProps) => {
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
    if (!request.error) onClose();
  };

  const onClose = () => setOpen(false);

  return (
    <>
      <IconButton
        disabled={disabled}
        data-testid="report-bug-button"
        aria-label={t('actions.bugReport')}
        aria-expanded={isOpen}
        {...restOfProps}
        onClick={() => setOpen(true)}
        title={t('actions.bugReport')}
      >
        <Icon type="bug" size="1.5rem" />
      </IconButton>
      <Drawer anchor="bottom" open={isOpen} onClose={onClose} sx={{ overflowY: 'auto' }} data-testid="bug-dialog">
        <BugForms onClose={onClose} onSubmit={onSubmit} />
      </Drawer>
    </>
  );
};

BugButton.displayName = 'BugButton';

export default BugButton;
